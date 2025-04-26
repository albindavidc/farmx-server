export class Community {
  constructor(
    public name: string,
    public description: string,
    public createdBy: string,
    public readonly id?: string,
    public readonly createdAt: Date = new Date(),
    public membersCount: number = 1,
    public imageUrl?: string,
    public categories: string[] = []
  ) {}
}
