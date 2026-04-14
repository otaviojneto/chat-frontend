import type {
  GetUserSettings,
  UpsertUserSettings,
} from "@/application/services/config-user/type";
import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { userConfigService } from "~/application/services/config-user/user-config";

export const useConfigUser = (
  id: string,
): UseQueryResult<GetUserSettings, Error> => {
  return useQuery({
    queryKey: ["config-user", id],
    queryFn: () => userConfigService.getConfigUser(id),
  });
};

export const useUpsertUserConfig = () => {
  return useMutation({
    mutationFn: (body: UpsertUserSettings) =>
      userConfigService.upsertUserConfig(body),
  });
};
