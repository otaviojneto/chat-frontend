import api from "../../api/api";
import type {
  AllRooms,
  CreateDirectRoomBody,
  CreateGroupRoomBody,
  Room,
} from "./type";

export const roomService = {
  getAllRooms: async (): Promise<AllRooms[]> => {
    const response = await api.get<AllRooms[]>("/room");
    return response.data;
  },

  getMyRooms: async (): Promise<Room[]> => {
    const response = await api.get<Room[]>("/room/me");
    return response.data;
  },

  createRoom: async (name: string): Promise<Room> => {
    const response = await api.post<Room>("/room", { name });
    return response.data;
  },

  createDirectRoom: async (body: CreateDirectRoomBody): Promise<Room> => {
    const response = await api.post<Room>("/room/direct", body);
    return response.data;
  },

  createGroupRoom: async (body: CreateGroupRoomBody): Promise<Room> => {
    const response = await api.post<Room>("/room/group", body);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/room/${id}`);
  },
};
