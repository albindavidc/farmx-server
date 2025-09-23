import { inject, injectable } from "inversify";
import { Post } from "@domain/entities/community/post.entity";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { PostRepository } from "@domain/repositories/community/post.repository";
import { TYPES } from "@presentation/container/types";
import { CreatePostDto, PostResponseDto } from "@application/dto/community/post.dto";

@injectable()
export class CreateCommunityPostHandler {
  constructor(
    @inject(TYPES.PostRepository) private postRepository: PostRepository,
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
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
