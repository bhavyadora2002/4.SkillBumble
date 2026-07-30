const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  updateMe: (payload, token) => request("/auth/me", { method: "PUT", body: payload, token }),
  addSkill: (payload, token) => request("/auth/me/skills", { method: "POST", body: payload, token }),
  removeSkill: (userSkillId, token) => request(`/auth/me/skills/${userSkillId}`, { method: "DELETE", token }),
  listSkills: (query) => request(query ? `/skills?q=${encodeURIComponent(query)}` : "/skills"),
  listMatches: (token) => request("/matches", { token }),
  findMatches: (token) => request("/matches/find", { token }),
  createMatch: (payload, token) => request("/matches", { method: "POST", body: payload, token }),
  updateMatch: (matchId, payload, token) => request(`/matches/${matchId}`, { method: "PATCH", body: payload, token }),
  listSessions: (token) => request("/sessions", { token }),
  createSession: (payload, token) => request("/sessions", { method: "POST", body: payload, token }),
  updateSession: (sessionId, payload, token) => request(`/sessions/${sessionId}`, { method: "PATCH", body: payload, token }),
  unratedSessions: (token) => request("/sessions/unrated", { token }),
  createRating: (payload, token) => request("/ratings", { method: "POST", body: payload, token }),
  listRatings: (token) => request("/ratings", { token }),
  listPosts: () => request("/posts"),
  listMyPosts: (token) => request("/posts/mine", { token }),
  createPost: (payload, token) => request("/posts", { method: "POST", body: payload, token }),
  updatePost: (postId, payload, token) => request(`/posts/${postId}`, { method: "PATCH", body: payload, token }),
  getCredits: (token) => request("/credits/balance", { token }),
  getTransactions: (token) => request("/credits/transactions", { token }),
};
