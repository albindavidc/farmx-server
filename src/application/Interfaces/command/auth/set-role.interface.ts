import { RoleResponseDto, RoleUpdateDto } from "@application/dtos/role.dto.js";
export interface ISetRole {
  execute(dto: RoleUpdateDto): Promise<RoleResponseDto>;
}
