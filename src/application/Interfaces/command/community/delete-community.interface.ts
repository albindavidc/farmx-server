import { DeleteCommunityCommand } from "@application/commands/community/delete-community.command";

export interface IDeleteCommunity {
  execute(command: DeleteCommunityCommand): Promise<boolean>;
}
