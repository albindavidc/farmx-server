import { inject, injectable } from "inversify";
import { CreatePostDto, PostResponseDto } from "../../../dto/community/post.dto";
import { TYPES } from "../../../../../presentation/container/types";
import { Post } from "../../../../../domain/entities/community/post.entity";
import { PostRepository } from "../../../../../domain/interfaces/repositories/community/post.repository";
import { CommunityRepository } from "../../../../../domain/interfaces/repositories/community/community.repository";

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
      dto.text,
      new Date(),
      dto.userId,
      dto.userName,
      dto.userRole,
      dto.communityId,
      community.name,
      dto.imageUrl || "",
      false,
      undefined,
      undefined
    );

    const created = await this.postRepository.create(post);
    return PostResponseDto.fromEntity(created);
  }
}
