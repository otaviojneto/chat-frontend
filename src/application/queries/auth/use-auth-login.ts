import { authService } from "@/application/services/auth/auth";
import type { AuthLogin } from "@/application/services/auth/types";
import { useMutation } from "@tanstack/react-query";

function persistTokenFromResponse(data: unknown) {
  if (!data || typeof data !== "object") return;
  const record = data as Record<string, unknown>;
  const token =
    (typeof record.access_token === "string" && record.access_token) ||
    (typeof record.token === "string" && record.token);
  if (token) {
    localStorage.setItem("token", token);
  }
}

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: (body: AuthLogin) => authService.authLogin(body),
    onSuccess: (data) => {
      persistTokenFromResponse(data);
    },
  });
};
