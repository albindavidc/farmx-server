import { inject, injectable } from "inversify";
import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../../utils/TokenUtility";
import { RoleResponseDto, RoleUpdateDto } from "../dto/Role.dto";
import { UserNotFoundException } from "../exceptions/UserNotFound.exception";
import { UserMapper } from "../mappers/User.mapper";
import { TYPES } from "../../../presentation/container/types";

@injectable()
export class SetRoleUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

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
