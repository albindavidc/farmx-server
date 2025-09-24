import { inject, injectable } from "inversify";
import { Post } from "@domain/entities/community/post.entity";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface";
import { TYPES } from "@presentation/container/types";
import { CreatePostDto, PostResponseDto } from "@application/dtos/community/post.dto";
import { ICreateCommunityPost } from "@application/interfaces/command/community/post/create-post.interface";

@injectable()
export class CreateCommunityPostHandler implements ICreateCommunityPost {
  constructor(
    @inject(TYPES.PostRepository) private postRepository: IPostRepository,
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(dto: CreatePostDto): Promise<PostResponseDto> {
    const community = await this.communityRepository.findById(dto.communityId);
    if (!community) {
      throw new Error(`Community with ID ${dto.communityId} not found`);
    }

    const post = new Post(
      "",
      dto.text,
      new Date(),
      dto.userId,
      dto.userName,
      dto.userRole,
      dto.communityId,
      community.getName(),
      dto.imageUrl || "",
      false,
      undefined
    );

    const created = await this.postRepository.create(post);
    return PostResponseDto.fromEntity(created);
  }
}
