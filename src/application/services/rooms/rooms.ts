import api from "../../api/api";
import type { Room } from "./type";

export const roomService = {
  getRooms: async (): Promise<Room[]> => {
    const response = await api.get<Room[]>("/room");
    return response.data;
  },

  createRoom: async (name: string): Promise<Room> => {
    const response = await api.post<Room>("/room", { name });
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/room/${id}`);
  },
};
