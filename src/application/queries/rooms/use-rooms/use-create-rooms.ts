import { roomService } from "@/application/services/rooms/rooms";
import { queryKeys } from "@/application/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRooms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: string) => roomService.createRoom(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rooms }),
        queryClient.invalidateQueries({ queryKey: queryKeys.roomsMe }),
        queryClient.invalidateQueries({ queryKey: queryKeys.initializeChat }),
      ]);
    },
  });
};
