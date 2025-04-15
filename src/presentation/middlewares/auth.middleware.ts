import { Request, Response, NextFunction } from "express";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import {
  generateAcessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../application/utils/TokenUtility";
import UserSchema from "../../infrastructure/database/schemas/UserSchema";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Access token required", false);
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await UserSchema.findById(decoded?.id);

    if (!user) {
      return sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
    }
    req.user = user;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Not able to get the access token";

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendResponseJson(
        res,
        StatusCodes.UNAUTHORIZED,
        `Refresh token required && ${errorMessage}`,
        false
      );
    }
    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      if (!decodedRefresh || !decodedRefresh.id || !decodedRefresh.role) {
        throw new Error("Invalid or expired refresh token");
      }
      const newAccessToken = generateAcessToken({
        id: decodedRefresh.id,
        email: decodedRefresh.email,
        role: decodedRefresh.role,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      const user = await UserSchema.findById(decodedRefresh.id);
      if (!user) {
        return sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
      }

      req.user = user;
      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid refresh Token";
      return sendResponseJson(res, StatusCodes.FORBIDDEN, errorMessage, false);
    }
  }
};
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return sendResponseJson(res, StatusCodes.FORBIDDEN, "User not found", false);
    }
    if (!roles.includes(req.user.role)) {
      return sendResponseJson(res, StatusCodes.FORBIDDEN, "Forbidden to enter here", false);
    }
    next();
  };
};
