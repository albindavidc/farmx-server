// import { inject, injectable } from "inversify";

// import { TYPES } from "@presentation/container/types.js";
// import { LoginRequest, LoginResponse } from "@application/dtos/login.dto.js";
// import {
//   generateAcessToken,
//   generateRefreshToken,
//   TokenPayload,
// } from "@application/utils/token-utility.js";
// import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
// import { EmailVO } from "@domain/value-objects/user/email.vo.js";
// import { UserMapper } from "@application/mappers/user.mapper.js";

// @injectable()
// export class LoginService {
//   constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

//   async login(request: LoginRequest): Promise<LoginResponse> {
//     const email = EmailVO.create(request.email);
//     const user = await this.userRepository.findByEmail(email);

//     if (!user) {
//       throw new Error("Invalid email or password");
//     }

//     if (!user.isVerified || !user.id) {
//       throw new Error("Account not verified");
//     }

//     const payload: TokenPayload = { id: user.id, email: user.email, role: user.role };
//     const accessToken = generateAcessToken(payload);
//     const refreshToken = generateRefreshToken(payload);

//     const userDto = UserMapper.toDto(user);
//     if (!userDto) {
//       throw new Error("Failed to map user entity to DTO");
//     }

//     return { user: userDto, accessToken, refreshToken };
//   }
// }
