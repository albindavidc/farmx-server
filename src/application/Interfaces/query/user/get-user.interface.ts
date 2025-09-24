import {UserDto} from "@application/dtos/user.dto";

export interface IGetUser {
    execute(id: string): Promise<UserDto>;
}