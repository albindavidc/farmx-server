import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/repositories/user.repository";
import { TYPES } from "@presentation/container/types";
import { RoleUpdateDto, RoleResponseDto } from "@application/dto/role.dto";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception";
import { UserMapper } from "@application/mappers/user.mapper";
import { generateAcessToken, generateRefreshToken } from "@application/utils/token-utility";
import { ISetRole } from "@application/Interfaces/command/auth/set-role.interface";

@injectable()
export class SetRoleHandler implements ISetRole {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(dto: RoleUpdateDto): Promise<RoleResponseDto> {
    const user = await this.userRepository.setRole(dto.userId, dto.role);
    if (!user) {
      throw new UserNotFoundException(dto.userId);
    }

    const payload = { id: user._id || "", email: user.email, role: user.role };
    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user: UserMapper.toDto(user), accessToken, refreshToken };
  }
}
