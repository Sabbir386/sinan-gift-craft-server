import { Request, Response } from "express";
import SocialMediaPost from "./socialMediaPost.model";
import { getPostsByUserId } from "./socialMediaPost.service";

export const createSocialMediaPost = async (req: Request, res: Response) => {
    try {
        const postData = req.body;

        // Create a new SocialMediaPost document
        const newPost = new SocialMediaPost(postData);

        // Save the document to the database
        await newPost.save();

        // Respond with the newly created post
        res.status(201).json({
            message: "Social media post created successfully",
            post: newPost,
        });
    } catch (error) {
        // Handle errors and respond with a generic message
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllSocialMediaPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await SocialMediaPost.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateSocialMediaPostStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const post = await SocialMediaPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        post.status = status;
        await post.save();

        res.json({ message: "Status updated successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getUserSpecificSocialMediaPost = async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId query parameter is required" });
    }

    try {
        const posts = await getPostsByUserId(userId as string);
        return res.status(200).json({
            message: "Social media posts retrieved successfully",
            posts,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};
export const deleteUserSpecificSocialMediaPost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await SocialMediaPost.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ error: "Social media post not found" });
        }

        res.status(200).json({ message: "Social media post deleted successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
