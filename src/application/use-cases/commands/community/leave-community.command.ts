export class LeaveCommunityCommand {
  constructor(public readonly communityId: string, public readonly userId: string) {}
}
