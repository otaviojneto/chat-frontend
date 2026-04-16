export type AuthLogin = {
  email: string;
  password: string;
};

export type AuthRegister = {
  email: string;
  password: string;
  name: string;
};

/** Resposta típica de POST /auth/login — ajuste se o backend usar outros campos. */
export type AuthLoginResponse = {
  access_token?: string;
  token?: string;
};
