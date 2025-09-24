import * as admin from "firebase-admin";
import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/repositories/user.repository";
import { TYPES } from "@presentation/container/types";
import { GoogleAuthResponseDto } from "@application/dto/auth.dto";
import { AuthException } from "@application/exceptions/auth.exception";
import { UserMapper } from "@application/mappers/user.mapper";
import { generateAcessToken, generateRefreshToken } from "@application/utils/token-utility";
import { IGoogleAuth } from "@application/Interfaces/command/auth/google-auth.interface";

@injectable()
export class GoogleAuthHandler implements IGoogleAuth {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(idToken: string): Promise<GoogleAuthResponseDto> {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decodedToken;

    if (!email || !name || !uid) {
      throw new AuthException("Invalid Google Token");
    }

    const userData = {
      email: email as string,
      name: name as string,
      googleId: uid as string,
      isVerified: true,
      profile: picture as string | undefined,
    };

    const res = await this.userRepository.googleAuthLogin(userData);
    const userDto = UserMapper.toDto(res.user);

    if (!res.isNewUser) {
      const payload = {
        id: res.user._id || "",
        email: res.user.email,
        role: res.user.role,
      };
      const accessToken = generateAcessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return {
        user: userDto,
        isNewUser: res.isNewUser,
        accessToken,
        refreshToken,
      };
    }

    return { user: userDto, isNewUser: res.isNewUser };
  }
}
