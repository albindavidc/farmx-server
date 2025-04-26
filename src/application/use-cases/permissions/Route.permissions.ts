import { UserRole } from "../../../domain/enums/user-role.enum";

export const RoutePermissions: Record<string, UserRole[]> = {
  "/admin": [UserRole.ADMIN],
  "/farmer": [UserRole.ADMIN, UserRole.FARMER],
  "/user": [UserRole.ADMIN, UserRole.FARMER, UserRole.USER],
} as const;

export class PermissionChecker {
  public static hasAccess(route: string, role: string): boolean {
    const allowedRoles = RoutePermissions[route] || [];
    return allowedRoles.includes(role as UserRole);
  }
}
