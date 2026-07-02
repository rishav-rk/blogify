import * as postServices from "../../services/user/post.service.js";

export const createPost = async (req, res) => {
  const post = await postServices.createPost(req.token.user.id, req.body);
};
