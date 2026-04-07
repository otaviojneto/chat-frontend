import api from "../../api/api";
import type { BackendMessage, SendMessagePayload } from "./type";

export const messageService = {
  getMessages: async (roomId: string): Promise<BackendMessage[]> => {
    const response = await api.get<BackendMessage[]>(`/messages/${roomId}`);
    return response.data;
  },

  sendMessage: async (payload: SendMessagePayload): Promise<unknown> => {
    const response = await api.post("/messages", payload);
    return response.data;
  },
};
