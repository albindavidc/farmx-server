import { Request, Response, NextFunction } from "express";

// Query validation middleware
export function queryValidationMiddleware(allowedParams: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const invalidParams = Object.keys(req.query).filter((param) => !allowedParams.includes(param));

    if (invalidParams.length > 0) {
      res.status(400).json({
        success: false,
        message: `Invalid query parameters: ${invalidParams.join(", ")}`,
        allowedParams,
        statusCode: 400,
      });
    }

    next();
  };
}
