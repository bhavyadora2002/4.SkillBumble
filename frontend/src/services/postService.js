import { request } from "../api/client";

export const postService = {
  createPost: (payload) => request("/give-take/posts", { method: "POST", body: payload }),
  listPosts: () => request("/give-take/posts"),
  getPost: (id) => request(`/give-take/posts/${id}`),
};
