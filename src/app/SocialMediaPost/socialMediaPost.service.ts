import { Types } from "mongoose";
import SocialMediaPost, { ISocialMediaPost } from "./socialMediaPost.model";

export const createPost = async (data: ISocialMediaPost) => {
  const post = new SocialMediaPost({
    ...data,
    userId: new Types.ObjectId(data.userId),
  });
  return await post.save();
};

export const fetchAllPosts = async () => {
  return await SocialMediaPost.find();
};


export const updatePostStatus = async (
  id: string,
  status: "completed" | "pending" | "invalid-link"
) => {
  const post = await SocialMediaPost.findById(id);
  if (!post) throw new Error("Post not found");

  post.status = status;
  return await post.save();
};
export const getPostsByUserId = async (userId: string) => {
  console.log("from socail controller",userId)
  try {
      // Check if the userId is a valid ObjectId format
      if (!Types.ObjectId.isValid(userId)) {
          console.log("Invalid ObjectId format:", userId);
          throw new Error("Invalid userId format");
      }
      
      // Convert to ObjectId
      const objectId = new Types.ObjectId(userId);
      console.log("Converted ObjectId:", objectId);

      // Query posts by the ObjectId
      const posts = await SocialMediaPost.find({ userId: objectId });
      console.log("Posts found:", posts);

      // If no posts are found
      // if (posts.length === 0) {
      //     throw new Error("No social media posts found for this user");
      // }

      return posts;
  } catch (error: any) {
      console.error("Error retrieving posts:", error.message);
      throw new Error(error.message || "Unable to retrieve social media posts");
  }
};
export const deleteUserSpecificSocialMediaPost = async (id: string) => {
  try {
    const post = await SocialMediaPost.findByIdAndDelete(id);

    if (!post) {
      throw new Error("Social media post not found");
    }

    return post;
  } catch (error: any) {
    throw new Error(error.message || "Unable to delete social media post");
  }
};
