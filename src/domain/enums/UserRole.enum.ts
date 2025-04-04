export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  FARMER = "farmer",
}

export const RoutePermissions = {
  ADMIN: [UserRole.ADMIN],
  FARMER: [UserRole.ADMIN, UserRole.FARMER],
  USER: [UserRole.USER],
};
