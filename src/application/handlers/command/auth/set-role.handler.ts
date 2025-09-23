import { inject, injectable } from "inversify";
import { UserRepository } from "../../../../domain/repositories/user.repository";
import { TYPES } from "../../../../presentation/container/types";
import { RoleResponseDto, RoleUpdateDto } from "../../../dto/role.dto";
import { UserNotFoundException } from "../../../exceptions/user-not-found.exception";
import { UserMapper } from "../../../mappers/user.mapper";
import { generateAcessToken, generateRefreshToken } from "../../../utils/token-utility";

@injectable()
export class SetRoleHandler {
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
