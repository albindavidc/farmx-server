import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { CommandHandler } from "../../application/use-cases/interfaces/command.handler";
import { CreateCommunityCommand } from "../../application/use-cases/commands/community/create-community.command";
import { Community } from "../../domain/entities/community/community.entity";
import { ImageUploadService } from "../../application/services/image-upload.service";
import { Request, Response } from "express";
import { LoadCommunityHandler } from "../../application/use-cases/handlers/community/load-community.handler";
import { LoadCommunitiesHandler } from "../../application/use-cases/handlers/community/load-communities.handler";
import { JoinCommunityHandler } from "../../application/use-cases/handlers/community/join-community.handler";
import { LeaveCommunityHandler } from "../../application/use-cases/handlers/community/leave-community.handler";
import { LoadCommunityQuery } from "../../application/use-cases/queries/community/load-community.query";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import { JoinCommunityCommand } from "../../application/use-cases/commands/community/join-community-command";
import { LeaveCommunityCommand } from "../../application/use-cases/commands/community/leave-community.command";

@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.CreateCommunityHandler)
    private createCommunityHandler: CommandHandler<CreateCommunityCommand, Community>,
    @inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService,
    @inject(TYPES.LoadCommunityHandler) private loadCommunityHandler: LoadCommunityHandler,
    @inject(TYPES.LoadCommunitiesHandler) private loadCommunitiesHandler: LoadCommunitiesHandler,
    @inject(TYPES.JoinCommunityHandler) private joinCommunityHandler: JoinCommunityHandler,
    @inject(TYPES.LeaveCommunityHandler) private leaveCommunityHandler: LeaveCommunityHandler
  ) {}

  async createCommunity(req: Request, res: Response) {
    try {
      const { name, description, categories, imageUrl } = req.body;
      const userId = req.user?.id;
      //   let imageUrl: string | undefined;
      //   if (req.file) {
      //     imageUrl = this.imageUploadService.getImageUrl(req.file.filename);
      //   }

      const command = new CreateCommunityCommand(name, description, userId, imageUrl, categories);

      const community = await this.createCommunityHandler.execute(command);

      res.status(201).json(community);
    } catch (error) {
      console.error("Error creating community:", error);
      res
        .status(500)
        .json({ message: "Failed to create community", error: (error as Error).message });
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const imageUrl = await this.imageUploadService.uploadCategoryImages(req);

      res.status(200).json({
        success: true,
        imageUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occured";

      res.status(500).json({
        success: false,
        message: "Failed to process image upload",
        error: errorMessage,
      });
    }
  }

  async getCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.id;
      const command = new LoadCommunityQuery(communityId);
      const community = this.loadCommunityHandler.execute(command);

      if (!community) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "Community not found", false);
        return;
      }

      sendResponseJson(res, StatusCodes.OK, "Community get Successfull", true, community);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async getCommunities(req: Request, res: Response): Promise<void> {
    try {
      const communites = await this.loadCommunitiesHandler.execute();
      sendResponseJson(res, StatusCodes.OK, "Communites got successfully", true, communites);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async joinCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.id;
      const userId = req.body.userId || req.user?.id;

      if (!userId) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not authenticated", false);
        return;
      }

      const command = new JoinCommunityCommand(communityId, userId);
      const community = await this.joinCommunityHandler.execute(command);

      sendResponseJson(res, StatusCodes.OK, "Successfully joined community", true, community);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async leaveCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.id;
      const userId = req.body.userId || req.user?.id;

      if (!userId) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not authenticated", false);
      }

      const command = new LeaveCommunityCommand(communityId, userId);
      const community = await this.leaveCommunityHandler.execute(command);

      sendResponseJson(
        res,
        StatusCodes.OK,
        "Successfully leaved from the community",
        true,
        community
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}
