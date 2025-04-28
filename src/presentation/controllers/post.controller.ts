import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { CreateCommunityPostHandler } from "../../application/use-cases/handlers/community/post/create-post.handler";
import { GetCommunityPostQueryHandler } from "../../application/use-cases/handlers/community/post/get-post.handler";
import { GetCommunityPostsQueryHandler } from "../../application/use-cases/handlers/community/post/get-community-post.handler";
import { DeleteCommunityPostHandler } from "../../application/use-cases/handlers/community/post/delete-post.handler";
import { UpdateCommunityPostHandler } from "../../application/use-cases/handlers/community/post/update-post.handler";
import { ImageUploadService } from "../../application/services/image-upload.service";
import { Request, Response } from "express";
import { CreatePostDto, UpdatePostDto } from "../../application/use-cases/dto/community/post.dto";
import { UserPostRole, UserRole } from "../../domain/enums/user-role.enum";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";

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
    @inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

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
    try {
      const { id } = req.params;
      const post = await this.getCommunityPostQuery.execute(id);

      res.status(200).json(post);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async getCommunityPosts(req: Request, res: Response): Promise<void> {
    try {
      const { communityId } = req.params;
      const posts = await this.getCommunityPostsQuery.execute(communityId.toString());

      console.log('this is community posts', posts)

      res.status(200).json(posts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.body.postId || req.query.postId;

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
