import express from "express";
import { CommunityController } from "../controllers/community.controller";
import { container } from "../container/inversify.config";
import { TYPES } from "../container/types";
import { UploadMiddleware } from "../middlewares/upload-middleware";
import { PostController } from "../controllers/post.controller";
import { CommunityImageUploadMiddleware } from "../middlewares/community-image-upload.middleware";
import { queryValidationMiddleware } from "../middlewares/validation.middleware";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware";

const router = express.Router();

const allowedListParams = [
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "sortField",
  "sortDirection",
  "name",
  "categories",
  "createdBy",
  "filter",
];

/* Resolve controllers from container */
const communityController: CommunityController = container.get<CommunityController>(
  TYPES.CommunityController
);
const postController: PostController = container.get<PostController>(TYPES.PostController);
const uploadMiddleware: UploadMiddleware = container.get<UploadMiddleware>(TYPES.UploadMiddleware);
const communityImageUploadMiddleware: CommunityImageUploadMiddleware =
  container.get<CommunityImageUploadMiddleware>(TYPES.CommunityImageUploadMiddleware);
const authMiddleware: AuthMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

/* Routes */
router.post(
  "/create-community",
  authMiddleware.authenticate,
  communityController.createCommunity.bind(communityController)
);
router.post(
  "/upload-image",
  uploadMiddleware.handle(),
  communityController.uploadImage.bind(communityController)
);

router.get(
  "/:createdById",
  authMiddleware.authenticate,
  communityController.getCommunities.bind(communityController)
);
router.get(
  "/:id",
  authMiddleware.authenticate,
  communityController.getCommunity.bind(communityController)
);

router.get(
  "/admin/communities-listing",
  authMiddleware.authenticate,
  queryValidationMiddleware(allowedListParams),
  communityController.listCommunities.bind(communityController)
);

router.put("/:id", communityController.updateCommunity.bind(communityController));
router.delete("/:id", communityController.deleteCommunity.bind(communityController));

router.post(
  "/:id/members",
  authMiddleware.authenticate,
  communityController.joinCommunity.bind(communityController)
);
router.delete(
  "/:id/members",
  authMiddleware.authenticate,
  communityController.leaveCommunity.bind(communityController)
);

/* Community Post */
router.get(
  "/posts/:id",
  authMiddleware.authenticate,
  postController.getCommunityPosts.bind(postController)
);
router.post(
  "/create-post",
  authMiddleware.authenticate,
  postController.createPost.bind(postController)
);
router.delete(
  "/posts/:id",
  authMiddleware.authenticate,
  postController.deletePost.bind(postController)
);

router.post(
  "/post-upload-image/:id",
  authMiddleware.authenticate,
  communityImageUploadMiddleware.handle(),
  postController.uploadImage.bind(postController)
);
router.put(
  "/posts/:id",
  authMiddleware.authenticate,
  postController.updatePost.bind(postController)
);
router.get(
  "/community-post/:id",
  authMiddleware.authenticate,
  postController.getPost.bind(postController)
);

/* User side Community */
router.get(
  "/user/get-all-community",
  authMiddleware.authenticate,
  communityController.listAllCommunities.bind(communityController)
);

export default router;
