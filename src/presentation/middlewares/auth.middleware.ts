import { Request, Response, NextFunction, RequestHandler } from "express";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import {
  TokenPayload,
  verifyAccessToken,
} from "../../application/utils/TokenUtility";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const verifyToken = (allowedRoles?: string[]): RequestHandler => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader =
      (req.headers.authorization as string) || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendResponseJson(
        res,
        StatusCodes.UNAUTHORIZED,
        "No toekn provided",
        false
      );
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token) as TokenPayload;
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        sendResponseJson(
          res,
          StatusCodes.UNAUTHORIZED,
          "Access denied: Insufficient permisisons",
          false
        );
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid or expired token";

      sendResponseJson(res, StatusCodes.UNAUTHORIZED, errorMessage, false);
      return;
    }
  };
};
