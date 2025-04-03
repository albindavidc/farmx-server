import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/auth/jwt.service";

const jwtService = new JwtService(
  process.env.JWT_SECRET!,
  3600
);

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwtService.verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token" });
  }
};
