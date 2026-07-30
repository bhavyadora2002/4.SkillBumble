import { api } from "../api/client";

export const sessionService = {
  list: (token) => api.listSessions(token),
  create: (payload, token) => api.createSession(payload, token),
  update: (sessionId, payload, token) => api.updateSession(sessionId, payload, token),
  unrated: (token) => api.unratedSessions(token),
};
