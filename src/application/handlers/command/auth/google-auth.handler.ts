import * as admin from "firebase-admin";
import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { GoogleAuthResponseDto } from "@application/dtos/auth.dto.js";
import { AuthException } from "@application/exceptions/auth.exception.js";
import { IGoogleAuth } from "@application/interfaces/command/auth/google-auth.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { generateAcessToken, generateRefreshToken } from "@application/utils/token-utility.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

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
      name: name,
      email: email,
      googleId: uid as string,
      isVerified: true,
      profile: picture as string | undefined,
    };

    const userEntity = await UserMapper.toEntity(userData);

    const res = await this.userRepository.googleAuthLogin(userEntity);
    const userDto = UserMapper.toDto(res.user);

    if (!res.isNewUser) {
      const payload = {
        id: res.user.id || "",
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
