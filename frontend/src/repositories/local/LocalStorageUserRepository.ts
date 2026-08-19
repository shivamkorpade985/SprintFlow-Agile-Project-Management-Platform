/**
 * LocalStorageUserRepository
 *
 * Client-side implementation of `UserRepository` backed by browser `localStorage`.
 */
import type { User } from "../../features/team/types/user";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../../features/team/types/contracts/user";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { UserRepository } from "../UserRepository";

export class LocalStorageUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    return getItem<User[]>(STORAGE_KEYS.USERS) ?? [];
  }

  async getUserById(id: number): Promise<User | null> {
    const users = await this.getUsers();

    return users.find((user) => user.id === id) ?? null;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const users = await this.getUsers();

    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
    const user: User = {
      id: maxId + 1,
      ...data,
    };

    setItem(STORAGE_KEYS.USERS, [...users, user]);

    return user;
  }

  async updateUser(
    id: number,
    data: UpdateUserRequest,
  ): Promise<User> {
    const users = await this.getUsers();

    const existingUser = users.find((user) => user.id === id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...existingUser,
      ...data,
    };

    setItem(
      STORAGE_KEYS.USERS,
      users.map((user) => (user.id === id ? updatedUser : user)),
    );

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const users = await this.getUsers();

    setItem(
      STORAGE_KEYS.USERS,
      users.filter((user) => user.id !== id),
    );
  }
}