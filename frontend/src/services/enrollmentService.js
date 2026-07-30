import { request } from "../api/client";

export const enrollmentService = {
  listEnrollmentPosts: () => request("/enrollment/posts"),
  enroll: (postId) => request("/enrollment/enroll", { method: "POST", body: { post_id: postId } }),
  listMyEnrollments: () => request("/enrollment/my-enrollments"),
  listMyStudents: () => request("/enrollment/my-students"),
};
