import type { User } from "../../types/user";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../../types/contracts/user";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { UserRepository } from "../UserRepository";

export class LocalStorageUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    return getItem<User[]>(STORAGE_KEYS.USERS) ?? [];
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();

    return users.find((user) => user.id === id) ?? null;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const users = await this.getUsers();

    const user: User = {
      id: crypto.randomUUID(),
      ...data,
    };

    setItem(STORAGE_KEYS.USERS, [...users, user]);

    return user;
  }

  async updateUser(
    id: string,
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

  async deleteUser(id: string): Promise<void> {
    const users = await this.getUsers();

    setItem(
      STORAGE_KEYS.USERS,
      users.filter((user) => user.id !== id),
    );
  }
}