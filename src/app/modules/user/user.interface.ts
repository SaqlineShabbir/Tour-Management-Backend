import type { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface AuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export interface IUser {
  _id? :Types.ObjectId
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVarified?: boolean;
  role: Role;
  auths: AuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
