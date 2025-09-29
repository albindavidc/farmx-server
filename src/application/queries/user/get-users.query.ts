export class GetUsersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,

    public readonly sortBy: string = "createdAt",
    public readonly sortDirection: "asc" | "desc" = "desc",

    public readonly search: string = ""
  ) {}
}
