import { RoleUpdateDto, RoleResponseDto } from "@application/dto/role.dto";
export interface ISetRole {
  execute(dto: RoleUpdateDto): Promise<RoleResponseDto>;
}
