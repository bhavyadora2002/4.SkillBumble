import { api } from "../api/client";

export const matchService = {
  list: (token) => api.listMatches(token),
  find: (token) => api.findMatches(token),
  create: (payload, token) => api.createMatch(payload, token),
  update: (matchId, payload, token) => api.updateMatch(matchId, payload, token),
};
