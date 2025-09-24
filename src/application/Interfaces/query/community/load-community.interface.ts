import {LoadCommunityQuery} from "@application/queries/community/load-community.query";
import {Community} from "@domain/entities/community/community.entity";

export interface ILoadCommunity{
    execute(query: LoadCommunityQuery): Promise<Community | null>;
}