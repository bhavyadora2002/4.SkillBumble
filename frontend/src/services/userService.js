import { request } from "../api/client";

export const userService = {
  getProfile: (id) => request(`/users/${id}`),
};
