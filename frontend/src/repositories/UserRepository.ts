import type { User } from "../features/team/types/user";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../features/team/types/contracts/user";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: string, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
}