import { GoogleAuthResponseDto } from "../dto/Auth.dto";

export interface AuthUseCase {
  googleAuth(idToken: string): Promise<GoogleAuthResponseDto>;
}
