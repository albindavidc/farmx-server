import { RoleUpdateDto } from "../dto/Role.dto";

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
