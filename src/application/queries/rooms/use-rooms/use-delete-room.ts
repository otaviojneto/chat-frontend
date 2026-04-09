import { roomService } from "@/application/services/rooms/rooms";
import { queryKeys } from "@/application/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
        queryClient.invalidateQueries({ queryKey: queryKeys.initializeChat }),
      ]);
    },
  });
};
