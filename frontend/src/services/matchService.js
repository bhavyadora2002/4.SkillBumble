import { request } from "../api/client";

export const matchService = {
  requestMatch: (payload) => request("/matches", { method: "POST", body: payload }),
  listMatches: () => request("/matches"),
  updateMatch: (id, status) => request(`/matches/${id}`, { method: "PUT", body: { status } }),
};
