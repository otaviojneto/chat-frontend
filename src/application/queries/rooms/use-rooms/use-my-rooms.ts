import { roomService } from "@/application/services/rooms/rooms";
import type { Room } from "@/application/services/rooms/type";
import { queryKeys } from "@/application/queries/keys";
import { useQuery } from "@tanstack/react-query";

export const useMyRooms = () => {
  return useQuery<Room[]>({
    queryKey: queryKeys.roomsMe,
    queryFn: () => roomService.getMyRooms(),
  });
};
