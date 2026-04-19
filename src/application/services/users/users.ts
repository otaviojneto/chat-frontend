import api from "../../api/api";
import type { User } from "./type";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/user");
    return response.data;
  },
};
