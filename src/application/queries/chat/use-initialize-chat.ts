import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Channel, Message } from "@/app/types";
import type { Room } from "~/application/services/rooms/type";
import { roomService } from "~/application/services/rooms/rooms";
import { userService } from "~/application/services/users/users";
import { queryKeys } from "../keys";

type InitializeChatResult = {
  currentUserId: string;
  channels: Channel[];
};

export const useInitializeChat = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.initializeChat,
    queryFn: async (): Promise<InitializeChatResult> => {
      const users = await queryClient.fetchQuery({
        queryKey: queryKeys.users,
        queryFn: () => userService.getUsers(),
      });
      const existingUser = users.find((u) => u.name === "Otavio");
      const user = existingUser ?? (await userService.createUser("Otavio"));
      if (!existingUser) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.users });
      }

      const rooms = await queryClient.fetchQuery({
        queryKey: queryKeys.rooms,
        queryFn: () => roomService.getRooms(),
      });

      const channels: Channel[] = rooms.map((room) => ({
        id: room.id,
        name: room.name,
        messages: [] as Message[],
      }));

      return { currentUserId: user.id, channels };
    },
  });
};

export const useRooms = () => {
  return useQuery<Room[]>({
    queryKey: queryKeys.rooms,
    queryFn: () => roomService.getRooms(),
  });
};
