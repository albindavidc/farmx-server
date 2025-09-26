import {LoadCommunityQuery} from "@application/queries/community/load-community.query";
import {CommunityResponseDto} from "@application/dtos/community/community-response.dto";

export interface ILoadCommunity{
    execute(query: LoadCommunityQuery): Promise<CommunityResponseDto>;
}