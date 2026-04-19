import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/application/services/rooms/rooms";
import { queryKeys } from "@/application/queries/keys";
import type { AllRooms } from "@/application/services/rooms/type";

export const useAllRooms = () => {
  return useQuery<AllRooms[]>({
    queryKey: queryKeys.rooms,
    queryFn: () => roomService.getAllRooms(),
  });
};
