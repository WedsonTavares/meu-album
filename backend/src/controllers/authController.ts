import { prisma } from "../prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateToken } from "../utils/token";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import env from "../config/env";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(60).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleSchema = z.object({
  idToken: z.string().min(10),
});

const googleClient =
  env.googleClientId && new OAuth2Client(env.googleClientId);

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "E-mail já cadastrado");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Credenciais inválidas");
  }

  const match = await verifyPassword(password, user.passwordHash);
  if (!match) {
    throw new HttpError(401, "Credenciais inválidas");
  }

  const token = generateToken({ userId: user.id, email: user.email });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  if (!googleClient) {
    throw new HttpError(500, "Google login não configurado");
  }

  const { idToken } = googleSchema.parse(req.body);
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new HttpError(400, "Token Google inválido");
  }

  const email = payload.email;
  const name = payload.name || payload.given_name || payload.email;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, passwordHash: "", name },
    });
  }

  const token = generateToken({ userId: user.id, email: user.email });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});
