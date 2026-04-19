import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Channel, Message } from "@/app/types";
import type { Room } from "~/application/services/rooms/type";
import { roomService } from "~/application/services/rooms/rooms";
import { userConfigService } from "~/application/services/config-user/user-config";
import { configUserQueryKey } from "../config-user/use-config-user";
import { queryKeys } from "../keys";

type InitializeChatResult = {
  currentUserId: string;
  channels: Channel[];
};

/**
 * Junta duas listas de salas (ex.: `GET /room` e `GET /room/me`) numa só.
 * Salas com o mesmo `id` aparecem uma vez só — a segunda lista sobrescreve a primeira
 * para aquele id. O resultado é ordenado alfabeticamente pelo `name`.
 */
function mergeRoomsById(a: Room[], b: Room[]): Room[] {
  const byId = new Map<string, Room>();
  for (const r of a) byId.set(r.id, r);
  for (const r of b) byId.set(r.id, r);
  return [...byId.values()].sort((x, y) => x.name.localeCompare(y.name));
}

export const useInitializeChat = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.initializeChat,
    queryFn: async (): Promise<InitializeChatResult> => {
      const config = await queryClient.fetchQuery({
        queryKey: configUserQueryKey,
        queryFn: () => userConfigService.getConfigUser(),
      });

      const [fromRoom, fromMe] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: queryKeys.rooms,
          queryFn: () => roomService.getAllRooms(),
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.roomsMe,
          queryFn: () => roomService.getMyRooms(),
        }),
      ]);

      const rooms = mergeRoomsById(fromRoom, fromMe);

      const channels: Channel[] = rooms.map((room) => ({
        id: room.id,
        name: room.name,
        messages: [] as Message[],
      }));

      return { currentUserId: config.userId, channels };
    },
  });
};

export const useRooms = () => {
  return useQuery<Room[]>({
    queryKey: ["rooms", "merged"] as const,
    queryFn: async () => {
      const [fromRoom, fromMe] = await Promise.all([
        roomService.getAllRooms(),
        roomService.getMyRooms(),
      ]);
      return mergeRoomsById(fromRoom, fromMe);
    },
  });
};
