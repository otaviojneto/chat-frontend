import type {
  GetUserSettings,
  UpsertUserSettings,
} from "@/application/services/config-user/type";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { userConfigService } from "~/application/services/config-user/user-config";

export const configUserQueryKey = (userId: string) =>
  ["config-user", userId] as const;

export const useConfigUser = (
  id: string,
): UseQueryResult<GetUserSettings, Error> => {
  return useQuery({
    queryKey: configUserQueryKey(id),
    queryFn: () => userConfigService.getConfigUser(id),
    enabled: Boolean(id),
  });
};

type UpsertUserConfigPayload = UpsertUserSettings & {
  avatar?: File | null;
};

export const useUpsertUserConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpsertUserConfigPayload) => {
      const { avatar: _avatar, ...payload } = body;
      return userConfigService.upsertUserConfig(payload);
    },
    onSuccess: (_data, variables) => {
      // Aplica já o que foi salvo no cache para o tema atualizar na hora (o GET pode vir defasado).
      queryClient.setQueryData<GetUserSettings>(
        configUserQueryKey(variables.userId),
        (prev) => ({
          ...(prev ?? { userId: variables.userId }),
          userId: variables.userId,
          name: variables.name ?? prev?.name,
          email: variables.email ?? prev?.email,
          colorTheme: variables.colorTheme ?? prev?.colorTheme,
          themeDarkMode: variables.themeDarkMode ?? prev?.themeDarkMode,
          avatarUrl: prev?.avatarUrl,
        }),
      );
      void queryClient.invalidateQueries({
        queryKey: configUserQueryKey(variables.userId),
      });
    },
  });
};
