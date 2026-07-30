import { api } from "../api/client";

export const authService = {
  signup: (payload) => api.signup(payload),
  login: (payload) => api.login(payload),
  me: (token) => api.me(token),
};
