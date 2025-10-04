import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { CreatePostDto, PostResponseDto } from "@application/dtos/community/post.dto.js";
import { ICreateCommunityPost } from "@application/interfaces/command/community/post/create-post.interface.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface.js";
import { PostMapper } from "@application/mappers/community/post.mapper.js";

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
    const toDto = PostMapper.dtoToEntity(dto, community.name);
    const created = await this.postRepository.create(toDto);

    // const post = new Post(
    //   "",
    //   new Date(),
    //   dto.text,
    //   dto.userId,
    //   dto.userRole,
    //   dto.userName,
    //   dto.communityId,
    //   community.name,
    //   dto.imageUrl || "",
    //   false,
    //   undefined
    // );

    // const created = await this.postRepository.create(post);
    // return PostResponseDto.fromEntity(created);

    return PostMapper.entityToDto(created);
  }
}
