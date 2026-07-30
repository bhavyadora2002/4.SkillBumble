import { api } from "../api/client";

export const skillService = {
  listSkills: () => api.listSkills(),
};
