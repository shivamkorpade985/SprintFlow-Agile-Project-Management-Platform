/**
 * UserRepository Interface
 *
 * Contract defining persistence operations for system-level User entities.
 */
import type { User } from "../features/team/types/user";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../features/team/types/contracts/user";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: number, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: number): Promise<void>;
}