import { inject, injectable } from "inversify";
import { FilterQuery } from "mongoose";

import { TYPES } from "@presentation/container/types.js";
import { User } from "@domain/entities/user.entity.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { PaginatedUsersResultDto } from "@application/dtos/user.dto.js";
import { IQueryHandler } from "@application/handlers/query/query.handler.js";
import { GetUsersQuery } from "@application/queries/user/get-users.query.js";
import { UserMapper } from "@application/mappers/user.mapper.js";

@injectable()
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery, PaginatedUsersResultDto> {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async execute(query: GetUsersQuery): Promise<PaginatedUsersResultDto> {
    const { page, limit, sortBy, sortDirection, search } = query;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error("Invalid pagination parameters");
    }

    const skip = (page - 1) * limit;
    const searchConditions = this.buildSearchFilterQuery(search);

    const [users, totalItems] = await this.userRepository.findAndCount({
      where: searchConditions,
      skip: skip,
      take: limit,
      order: { [sortBy]: sortDirection.toUpperCase() as "ASC" | "DESC" },
    });

    const totalPages = Math.ceil(totalItems / limit);
    return {
      items: users.map((user) => UserMapper.toDto(user)),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
  }

  private buildSearchFilterQuery(search?: string): FilterQuery<User> {
    if (!search || search.trim() === "") return {};

    const searchRegex = new RegExp(search.trim(), "i");

    return {
      $or: [{ name: searchRegex }, { email: searchRegex }],
    };
  }
}
