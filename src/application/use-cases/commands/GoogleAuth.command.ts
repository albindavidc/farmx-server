import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { GoogleAuthResponseDto } from "../dto/Auth.dto";
import * as admin from "firebase-admin";
import { AuthException } from "../exceptions/Auth.exception";
import { UserMapper } from "../mappers/User.mapper";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../../utils/TokenUtility";

export class GoogleAuthCommand {
  constructor(private userRepository: UserRepository) {}

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
