// import { inject, injectable } from "inversify";
// import { TYPES } from "../../../../presentation/container/types";
// import { UserRepository } from "../../../../domain/interfaces/repositories/user.repository";
// import { UserDto } from "../../dto/User.dto";
// import { CreateUserCommand } from "../../commands/user/create-user.command";

// @injectable()
// export class CreateUserHandler{
//     constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository){};

//     async execute(command: CreateUserCommand): Promise<UserDto>{
//         const {name, email, role}  = command.dto;
//         const user = {
//             name,
//             email,
//             role,
//             isVerified: true,
//         }

//         return this.userRepository.create(user);
//     }
// }