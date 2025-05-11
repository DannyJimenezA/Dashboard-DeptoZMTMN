// src/context/AuthContextHelper.ts
let logoutFn: () => void;
let loginFn: (token: string) => void;

export const setAuthHelpers = (
  login: (token: string) => void,
  logout: () => void
) => {
  loginFn = login;
  logoutFn = logout;
};

export const logout = () => logoutFn && logoutFn();
export const login = (token: string) => loginFn && loginFn(token);
