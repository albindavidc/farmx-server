import { UserDto } from "@application/dtos/user.dto.js";

export interface IGetUser {
    execute(id: string): Promise<Partial<UserDto>>;
}