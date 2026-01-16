import jwt from "jsonwebtoken";
import env from "../config/env";

interface TokenPayload {
  userId: number;
  email: string;
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}
