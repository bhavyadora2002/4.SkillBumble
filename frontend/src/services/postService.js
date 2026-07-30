import { api } from "../api/client";

export const postService = {
  list: () => api.listPosts(),
  listMine: (token) => api.listMyPosts(token),
  create: (payload, token) => api.createPost(payload, token),
  update: (postId, payload, token) => api.updatePost(postId, payload, token),
};
