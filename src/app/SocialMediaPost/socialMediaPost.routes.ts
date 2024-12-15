import { Router } from "express";
import {
    createSocialMediaPost,
    deleteUserSpecificSocialMediaPost,
    getAllSocialMediaPosts,
    getUserSpecificSocialMediaPost,
    updateSocialMediaPostStatus,
} from "./socialMediaPost.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.post("/", auth(USER_ROLE.user), createSocialMediaPost);
router.get("/", auth(USER_ROLE.user, USER_ROLE.superAdmin), getAllSocialMediaPosts);
router.patch("/:id", auth(USER_ROLE.superAdmin), updateSocialMediaPostStatus);
router.get("/user-posted", auth(USER_ROLE.user), getUserSpecificSocialMediaPost);
router.delete("/:id", auth(USER_ROLE.superAdmin), deleteUserSpecificSocialMediaPost);

export const SocialMediaPostRoutes = router;
