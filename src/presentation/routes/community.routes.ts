import express from "express";
import { CommunityController } from "../controllers/community.controller";
import { container } from "../container/inversify.config";
import { TYPES } from "../container/types";
import { authenticate } from "../middlewares/auth.middleware";
import { UploadMiddleware } from "../middlewares/upload-middleware";

const router = express.Router();

const communityController: CommunityController = container.get<CommunityController>(
  TYPES.CommunityController
);

const uploadMiddleware: UploadMiddleware = container.get<UploadMiddleware>(TYPES.UploadMiddleware);

router.post(
  "/create-community",
  authenticate,
  communityController.createCommunity.bind(communityController)
);

router.post(
  "/upload-image",
  uploadMiddleware.handle(),
  communityController.uploadImage.bind(communityController)
);

router.get("/", authenticate, communityController.getCommunities.bind(communityController));
router.get("/:id", authenticate, communityController.getCommunity.bind(communityController));
router.post(
  "/:id/members",
  authenticate,
  communityController.joinCommunity.bind(communityController)
);
router.delete(
  "/:id/members",
  authenticate,
  communityController.leaveCommunity.bind(communityController)
);

export default router;
