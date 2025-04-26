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
export default router;
