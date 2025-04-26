import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { CommandHandler } from "../../application/use-cases/interfaces/command.handler";
import { CreateCommunityCommand } from "../../application/use-cases/commands/create-community.command";
import { Community } from "../../domain/entities/community.entity";
import { ImageUploadService } from "../../application/services/image-upload.service";
import { Request, Response } from "express";

@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.CreateCommunityHandler)
    private createCommunityHandler: CommandHandler<CreateCommunityCommand, Community>,
    @inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService
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
}
