import { UserRepository } from "../../../../domain/interfaces/repositories/User.repository";

export class CreateUserCommand {
  constructor(public readonly userRepository: UserRepository) {}
}
