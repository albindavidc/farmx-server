import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { CreateCommunityCommand } from "@application/commands/community/create-community.command";
import { UpdateCommunityCommand } from "@application/commands/community/update-community.command";
import { DeleteCommunityCommand } from "@application/commands/community/delete-community.command";
import { LoadCommunityQuery } from "@application/queries/community/load-community.query";
import { UpdateCommunityRequestDto } from "@application/dto/community/update-community.dto";
// import {CommandHandler} from "@application/interfaces/command.interface";
import { LoadCommunityHandler } from "@application/handlers/query/community/load-community.handler";
import { LoadCommunitiesHandler } from "@application/handlers/query/community/load-communities.handler";
import { ListCommunitiesHandler } from "@application/handlers/query/community/list-communities.handler";
import { JoinCommunityHandler } from "@application/handlers/command/community/join-community.handler";
import { LeaveCommunityHandler } from "@application/handlers/command/community/leave-community.handler";
import { UpdateCommunityCommandHandler } from "@application/handlers/command/community/update-community.handler";
import { DeleteCommunityCommandHandler } from "@application/handlers/command/community/delete-community.handler";
import sendResponseJson from "@application/utils/message";
import { ImageUploadService } from "@infrastructure/services/image-upload.service";
import { TYPES } from "@presentation/container/types";
import { CustomError } from "@presentation/middlewares/error-handler.middleware";
import { CreateCommunityHandler } from "@application/handlers/command/community/create-community.handler";
import { JoinCommunityCommand } from "@application/commands/community/join-community-command";
import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command";

@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.CreateCommunityHandler)
    private createCommunityHandler: CreateCommunityHandler,
    @inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService,
    @inject(TYPES.LoadCommunityHandler) private loadCommunityHandler: LoadCommunityHandler,
    @inject(TYPES.LoadCommunitiesHandler) private loadCommunitiesHandler: LoadCommunitiesHandler,
    @inject(TYPES.ListCommunitiesHandler) private listCommunitiesHandler: ListCommunitiesHandler,
    @inject(TYPES.JoinCommunityHandler) private joinCommunityHandler: JoinCommunityHandler,
    @inject(TYPES.LeaveCommunityHandler) private leaveCommunityHandler: LeaveCommunityHandler,
    @inject(TYPES.UpdateCommunityHandler)
    private updateCommunityCommand: UpdateCommunityCommandHandler,
    @inject(TYPES.DeleteCommunityHandler)
    private deleteCommunityCommand: DeleteCommunityCommandHandler
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
      const createdById = req.params.createdById;
      const communites = await this.loadCommunitiesHandler.execute(createdById);

      // console.log('this is createdbyid',createdById)

      // console.log("this is communities", communites);
      sendResponseJson(res, StatusCodes.OK, "Communites got successfully", true, communites);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async listCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 items per page
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string) || "desc";

      const name = req.query.name as string;
      const categories = req.query.categories
        ? (req.query.categories as string).split(",").map((cat) => cat.trim())
        : undefined;
      const createdBy = req.query.createdBy as string;

      // Build sort object
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Build filter object
      const filter: Partial<{ name: string; categories: string[]; createdBy: string }> = {};
      if (name) filter.name = name;
      if (categories) filter.categories = categories;
      if (createdBy) filter.createdBy = createdBy;

      const result = await this.listCommunitiesHandler.execute({
        page,
        limit,
        sort,
        filter,
      });

      // console.log(result, " this is the result that we are sending to the front-end");

      res.status(200).json({
        success: true,
        message: "Communities retrieved successfully",
        items: result.communities || [],
        totalItems: result.total || 0,
        totalPages: Math.ceil((result.total || 0) / (result.limit || 1)),
        currentPage: result.page || 1,

        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
          hasNext: result.page * result.limit < result.total,
          hasPrev: result.page > 1,
        },
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 400, "LIST_COMMUNITIES_FAILED"));
      }
    }
  }

  async listAllCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listCommunitiesHandler.execute();

      // console.log(result, " this is the result that we are sending to the front-end");

      res.status(200).json(result.communities || []);
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 400, "LIST_COMMUNITIES_FAILED"));
      }
    }
  }

  async updateCommunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateCommunityRequestDto = req.body;
      const command = new UpdateCommunityCommand(id, dto);
      const community = await this.updateCommunityCommand.handle(command);

      res.status(200).json({
        success: true,
        message: "Community updated successfully",
        data: community,
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          next(new CustomError(error.message, 404, "COMMUNITY_NOT_FOUND"));
        } else if (error.message.includes("already exists")) {
          next(new CustomError(error.message, 409, "COMMUNITY_NAME_CONFLICT"));
        } else {
          next(new CustomError(error.message, 400, "UPDATE_COMMUNITY_FAILED"));
        }
      }
    }
  }

  async deleteCommunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteCommunityCommand(id);
      const deleted = await this.deleteCommunityCommand.handle(command);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: "Community deleted successfully",
          statusCode: 200,
        });
      } else {
        throw new Error("Failed to delete community");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          next(new CustomError(error.message, 404, "COMMUNITY_NOT_FOUND"));
        } else {
          next(new CustomError(error.message, 400, "DELETE_COMMUNITY_FAILED"));
        }
      }
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
