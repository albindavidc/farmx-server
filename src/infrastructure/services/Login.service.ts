import { inject, injectable } from "inversify";
import { generateAcessToken, generateRefreshToken, TokenPayload } from "../../application/utils/TokenUtility";
import { UserRepository } from "../../domain/interfaces/repositories/user.repository";
import { Email } from "../../domain/value-objects/Email.vo";
import { TYPES } from "../../presentation/container/types";
import { LoginRequest, LoginResponse } from "../use-cases/dto/login.dto";

@injectable()
export class LoginService {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const email = Email.create(request.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified || !user._id) {
      throw new Error("Account not verified");
    }

    const payload: TokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }
}
