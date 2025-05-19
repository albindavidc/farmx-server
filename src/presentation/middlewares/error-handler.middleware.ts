import { Request, Response } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class CustomError extends Error implements ApiError {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(error: ApiError, req: Request, res: Response): void {
  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_ERROR";

  // Log error for debugging (but don't expose sensitive info)
  console.error(`[${new Date().toISOString()}] Error ${statusCode}:`, {
    message: error.message,
    code,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  // WCAG compliant error response structure
  const errorResponse = {
    success: false,
    error: {
      message: getAccessibleErrorMessage(error.message, statusCode),
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
    // Provide helpful context for screen readers and assistive technologies
    accessibility: {
      role: "alert",
      ariaLive: "assertive",
      description: getErrorDescription(statusCode),
    },
  };

  res.status(statusCode).json(errorResponse);
}

function getAccessibleErrorMessage(message: string, statusCode: number): string {
  // Ensure error messages are clear and actionable for all users
  switch (statusCode) {
    case 400:
      return `Invalid request: ${message}`;
    case 401:
      return "Authentication required. Please provide valid credentials.";
    case 403:
      return "Access denied. You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return `Conflict: ${message}`;
    case 422:
      return `Validation error: ${message}`;
    case 429:
      return "Too many requests. Please wait before trying again.";
    case 500:
      return "An internal server error occurred. Please try again later.";
    default:
      return message || "An unexpected error occurred.";
  }
}

function getErrorDescription(statusCode: number): string {
  // WCAG compliant descriptions for screen readers
  switch (statusCode) {
    case 400:
      return "The request could not be processed due to invalid data or format.";
    case 401:
      return "You need to log in or provide valid authentication to access this resource.";
    case 403:
      return "Your account does not have the necessary permissions for this action.";
    case 404:
      return "The page or resource you are looking for does not exist.";
    case 409:
      return "The request conflicts with the current state of the resource.";
    case 422:
      return "The request data is invalid or incomplete.";
    case 429:
      return "You have exceeded the rate limit. Please wait before making another request.";
    case 500:
      return "A server error occurred. Our team has been notified and is working on a fix.";
    default:
      return "An error occurred while processing your request.";
  }
}

// Not found middleware
export function notFoundHandler(req: Request, res: Response): void {
  const error = new CustomError(`Endpoint ${req.path} not found`, 404, "ENDPOINT_NOT_FOUND");

  res.status(404).json({
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      suggestions: [
        "Check the URL for typos",
        "Verify the HTTP method (GET, POST, PUT, DELETE)",
        "Refer to the API documentation for available endpoints",
      ],
    },
    accessibility: {
      role: "alert",
      ariaLive: "assertive",
      description: "The requested endpoint does not exist in our API.",
    },
  });
}
