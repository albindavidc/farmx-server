import { Request, Response, NextFunction } from "express";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import {
  generateAcessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../application/utils/TokenUtility";
import UserSchema, { UserDocument } from "../../infrastructure/database/schemas/UserSchema";

interface AuthRequest extends Request {
  user?: UserDocument;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('Cookies recieved', req.cookies)
  const accessToken = req.cookies.accessToken;

  // console.log(`This is access token in the back-end: ${accessToken}`);
  if (!accessToken) {
    sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Access token required", false);
    return
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await UserSchema.findById(decoded?.id);

    if (!user) {
      sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Not able to get the access token";

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      sendResponseJson(
        res,
        StatusCodes.UNAUTHORIZED,
        `Refresh token required && ${errorMessage}`,
        false
      );
      return;
    }
    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      if (!decodedRefresh) {
        throw new Error("Invalid or expired refresh token");
      }
      const newAccessToken = generateAcessToken({
        id: decodedRefresh.id,
        email: decodedRefresh.email,
        role: decodedRefresh.role,
      });

      console.log(`New access token is generated in the back-end: auth ${newAccessToken} && ${decodedRefresh}`)
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      const user = await UserSchema.findById(decodedRefresh.id);
      if (!user) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid refresh Token";
      sendResponseJson(res, StatusCodes.FORBIDDEN, errorMessage, false);
      return;
    }
  }
};
export const authorize = (roles: string[]) => {

  
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('printing roles',  req.user, req.user?.role)
    if (!req.user || !req.user.role) {
      sendResponseJson(res, StatusCodes.FORBIDDEN, "User not found", false);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendResponseJson(res, StatusCodes.FORBIDDEN, "Forbidden to enter here", false);
      return;
    }
    next();
  };
};
