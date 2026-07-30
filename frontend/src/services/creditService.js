import { api } from "../api/client";

export const creditService = {
  getBalance: (token) => api.getCredits(token),
  getTransactions: (token) => api.getTransactions(token),
};
