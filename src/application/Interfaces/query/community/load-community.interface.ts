import { LoadCommunityQuery } from "@application/queries/community/load-community.query.js";
import { Community } from "@domain/entities/community/community.entity.js";

export interface ILoadCommunity {
  execute(query: LoadCommunityQuery): Promise<Community | null>;
}
