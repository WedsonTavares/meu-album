import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { verifyToken } from "../utils/token";
import { HttpError } from "../utils/httpError";

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new HttpError(401, "Missing authorization header"));
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return next(new HttpError(401, "Invalid authorization header"));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}
