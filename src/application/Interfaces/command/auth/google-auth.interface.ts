import { GoogleAuthResponseDto } from "@application/dtos/auth.dto.js";


export interface IGoogleAuth {
  execute(idToken: string): Promise<GoogleAuthResponseDto>;
}
