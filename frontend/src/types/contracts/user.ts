import type { UserRole } from "../user";

export interface CreateUserRequest {
  name: string;
  avatar?: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name: string;
  avatar?: string;
  role: UserRole;
}