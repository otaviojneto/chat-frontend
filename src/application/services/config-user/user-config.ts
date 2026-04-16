import api from "../../api/api";
import type { UpsertUserSettings } from "./type";

export const userConfigService = {
  getConfigUser: async (): Promise<UpsertUserSettings> => {
    const response = await api.get<UpsertUserSettings>("/config-user/me");
    return response.data;
  },

  upsertUserConfig: async (body: UpsertUserSettings): Promise<unknown> => {
    const response = await api.patch("/config-user", body);
    return response.data;
  },
};
