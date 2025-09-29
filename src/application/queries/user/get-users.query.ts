export class GetUsersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,

    public readonly sortBy: string = "createdAt",
    public readonly sortDirection: "asc" | "desc" = "desc",

    public readonly search: string = ""
  ) {}
}
