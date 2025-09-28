import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import { CreatePostDto, UpdatePostDto } from "@application/dtos/community/post.dto.js";
import { CreateCommunityPostHandler } from "@application/handlers/command/community/post/create-post.handler.js";
import { DeleteCommunityPostHandler } from "@application/handlers/command/community/post/delete-post.handler.js";
import { UpdateCommunityPostHandler } from "@application/handlers/command/community/post/update-post.handler.js";
import { GetCommunityPostsQueryHandler } from "@application/handlers/query/community/post/get-community-post.handler.js";
import { GetCommunityPostQueryHandler } from "@application/handlers/query/community/post/get-post.handler.js";
import sendResponseJson from "@application/utils/message.js";
import { UserPostRole, UserRole } from "@domain/enums/user-role.enum.js";
import { ImageUploadService } from "@infrastructure/services/image-upload.service.js";
import { TYPES } from "@presentation/container/types.js";

@injectable()
export class PostController {
  constructor(
    @inject(TYPES.CreateCommunityPostHandler) private createPostCommand: CreateCommunityPostHandler,
    @inject(TYPES.UpdateCommunityPostHandler) private updatePostCommand: UpdateCommunityPostHandler,
    @inject(TYPES.DeleteCommunityPostHandler) private deletePostCommand: DeleteCommunityPostHandler,
    @inject(TYPES.GetCommunityPostQueryHandler)
    private getCommunityPostQuery: GetCommunityPostQueryHandler,
    @inject(TYPES.GetCommunityPostsQueryHandler)
    private getCommunityPostsQuery: GetCommunityPostsQueryHandler,
    @inject(TYPES.ImageUploadService) private imageUploadService: ImageUploadService
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }
      console.log("--------------------------------------------------------------------");

      const { text, communityId } = req.body;

      // Validate required fields
      const errors: string[] = [];
      if (!text) errors.push("Text is required");
      if (!communityId) errors.push("Community ID is required");

      const userRole =
        req.user.role === UserPostRole.FARMER ? UserPostRole.FARMER : UserPostRole.ADMIN;
      const dto: CreatePostDto = {
        text,
        communityId,
        userId: req.user.id,
        userName: req.user.name,
        userRole: userRole,
      };

      const post = await this.createPostCommand.execute(dto);
      console.log("these are the text and communityId", text, communityId);

      if (req.file) {
        const imageUrl = await this.imageUploadService.uploadCommunityPostImages(req, post.id);

        const updatedPost = await this.updatePostCommand.execute(
          {
            id: post.id,
            text: post.text,
            imageUrl,
          },
          req.user.id,
          true
        );

        res.status(201).json(updatedPost);
      } else {
        res.status(201).json(post);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const { id } = req.params;
      const { text } = req.body;

      // Validate required fields
      if (!text) {
        throw new Error("Validation failed");
      }

      let imageUrl: string | undefined;

      const dto: UpdatePostDto = {
        id,
        text,
        imageUrl,
      };

      const isAdmin = req.user.role === UserRole.FARMER;
      const post = await this.updatePostCommand.execute(dto, req.user.id, isAdmin);

      if (req.file) {
        const imageUrl = await this.imageUploadService.uploadCommunityPostImages(req, post.id);

        const updatedPost = await this.updatePostCommand.execute(
          {
            id: post.id,
            text: post.text,
            imageUrl,
          },
          req.user.id,
          true
        );

        res.status(201).json(updatedPost);
      } else {
        res.status(201).json(post);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const { id } = req.params;
      const isAdmin = req.user.role === UserRole.FARMER;
      await this.deletePostCommand.execute(id, req.user.id, isAdmin);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async getPost(req: Request, res: Response): Promise<void> {
    console.log("--------------------------------------------------------------------");
    try {
      const { id } = req.params;
      const post = await this.getCommunityPostQuery.execute(id);

      console.log("this is community posts", post, id);

      // res.status(200).json(post);
      sendResponseJson(res, StatusCodes.OK, "Community get Successfull", true, post);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async getCommunityPosts(req: Request, res: Response): Promise<void> {
    console.log("--------------------------------------------------------------------");
    try {
      const communityId = req.params.id;
      const posts = await this.getCommunityPostsQuery.execute(communityId);

      console.log("this is community posts", posts, communityId);

      // res.status(200).json(posts);
      sendResponseJson(res, StatusCodes.OK, "Community get Successfull", true, posts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id || req.body.postId || req.query.postId;

      console.log(postId, "this is the postId from the backend");

      if (!postId) {
        throw new Error("Post ID is required for image upload");
      }

      const post = await this.getCommunityPostQuery.execute(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.userId !== req.user?.id) {
        throw new Error("Unauthorized to edit this post");
      }

      const imageUrl = await this.imageUploadService.uploadCommunityPostImages(req, postId);

      if (req.file) {
        const updatedPost = await this.updatePostCommand.execute(
          {
            id: post.id,
            text: post.text,
            imageUrl,
          },
          req.user?.id,
          true
        );

        res.status(201).json({
          success: true,
          imageUrl,
          post: updatedPost,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}
