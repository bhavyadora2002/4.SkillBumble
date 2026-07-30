import { api } from "../api/client";

export const ratingService = {
  create: (payload, token) => api.createRating(payload, token),
  list: (token) => api.listRatings(token),
};
