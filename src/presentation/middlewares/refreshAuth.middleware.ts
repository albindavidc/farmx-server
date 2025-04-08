import { Request, Response } from "express";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import {
  generateAcessToken,
  TokenPayload,
  verifyRefreshToken,
} from "../../application/utils/TokenUtility";

const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    sendResponseJson(
      res,
      StatusCodes.UNAUTHORIZED,
      "No refresh toekn received!",
      false
    );
  }

  try {
    const decoded = (await verifyRefreshToken(refreshToken)) as TokenPayload;

    const accessToken = generateAcessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    sendResponseJson(
      res,
      StatusCodes.OK,
      "Access token refreshed successfully",
      true,
      { accessToken }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid refresh token!";
    sendResponseJson(res, StatusCodes.FORBIDDEN, errorMessage, false);
  }
};

export default refresh;
