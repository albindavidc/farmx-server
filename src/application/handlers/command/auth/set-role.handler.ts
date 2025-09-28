import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { RoleResponseDto, RoleUpdateDto } from "@application/dtos/role.dto.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { ISetRole } from "@application/interfaces/command/auth/set-role.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { generateAcessToken, generateRefreshToken } from "@application/utils/token-utility.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

@injectable()
export class SetRoleHandler implements ISetRole {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(dto: RoleUpdateDto): Promise<RoleResponseDto> {
    const user = await this.userRepository.setRole(dto.userId, dto.role);
    if (!user) {
      throw new UserNotFoundException(dto.userId);
    }

    const payload = { id: user.id || "", email: user.email, role: user.role };
    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user: UserMapper.toDto(user), accessToken, refreshToken };
  }
}
