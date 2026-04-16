import api from "../../api/api";
import type { AuthLogin, AuthLoginResponse, AuthRegister } from "./types";

export const authService = {
  authLogin: async (body: AuthLogin): Promise<AuthLoginResponse> => {
    const { data } = await api.post<AuthLoginResponse>("/auth/login", body);
    return data;
  },

  authRegister: async (body: AuthRegister): Promise<unknown> => {
    const response = await api.post("/auth/register", body);
    return response.data;
  },
};
