import { DeleteCommunityCommand } from "@application/commands/community/delete-community.command.js";

export interface IDeleteCommunity {
  execute(command: DeleteCommunityCommand): Promise<boolean>;
}
