import type { CreateDirectRoomBody } from "@/application/services/rooms/type";
import { roomService } from "@/application/services/rooms/rooms";
import { queryKeys } from "@/application/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateDirectRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateDirectRoomBody) =>
      roomService.createDirectRoom(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
        queryClient.invalidateQueries({ queryKey: queryKeys.roomsMe }),
      ]);
    },
  });
};
