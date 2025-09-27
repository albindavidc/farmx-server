import { LoginRequest, LoginResponse } from "@application/dtos/login.dto";
import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
} from "@application/utils/token-utility";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { EmailVO } from "@domain/value-objects/user/email.vo";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class LoginService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const email = EmailVO.create(request.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified || !user.id) {
      throw new Error("Account not verified");
    }

    const payload: TokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }
}
