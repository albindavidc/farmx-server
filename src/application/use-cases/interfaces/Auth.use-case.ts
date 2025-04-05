import { GoogleAuthResponseDto } from "../auth/dto/Auth.dto";

export interface AuthUseCase {
  googleAuth(idToken: string): Promise<GoogleAuthResponseDto>;
}
