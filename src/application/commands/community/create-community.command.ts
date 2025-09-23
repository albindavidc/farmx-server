export class CreateCommunityCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly createdBy: string,
    public readonly imageUrl?: string,
    public readonly categories?: string[]
  ) {}
}
