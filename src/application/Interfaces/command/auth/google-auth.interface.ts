import { GoogleAuthResponseDto } from "@application/dto/auth.dto";

export interface IGoogleAuth {
  execute(idToken: string): Promise<GoogleAuthResponseDto>;
}
