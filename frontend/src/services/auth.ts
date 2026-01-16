import { User } from "../types";
import api from "./api";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
}

export const login = async (data: Credentials) => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const register = async (data: Credentials) => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};

export const loginWithGoogle = async (idToken: string) => {
  const res = await api.post<AuthResponse>("/auth/google", { idToken });
  return res.data;
};
