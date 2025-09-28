import { RoleUpdateDto } from "@application/dtos/role.dto.js";

export class RoleValidator {
  public static validate(dto: RoleUpdateDto): void {
    if (!dto.userId || !dto.role) {
      throw new Error("User ID and role are required");
    }
    if (!["USER", "FARMER", "ADMIN"].includes(dto.role)) {
      throw new Error("Invalid role");
    }
  }
}
