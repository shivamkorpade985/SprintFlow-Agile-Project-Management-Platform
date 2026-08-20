/**
 * ApiUserRepository
 *
 * Concrete implementation of `UserRepository` backed by the ASP.NET Core REST API.
 * Communicates with backend endpoints at `/api/users` and `/api/users/{id}` using numeric IDs.
 */
import type { User } from "../../features/team/types/user";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../../features/team/types/contracts/user";
import type { UserRepository } from "../UserRepository";

export class ApiUserRepository implements UserRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
      "http://localhost:5000";
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as User;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const payload = {
      name: data.name,
      role: data.role,
      avatar: data.avatar ?? null,
    };

    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as User;
  }

  async updateUser(
    id: number,
    data: UpdateUserRequest,
  ): Promise<User> {
    const payload = {
      name: data.name,
      role: data.role,
      avatar: data.avatar ?? null,
    };

    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      throw new Error(`User with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update user ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    // 204 No Content returned from API; construct and return updated user object
    return {
      id,
      name: data.name,
      role: data.role,
      avatar: data.avatar,
    };
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      throw new Error(`User with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete user ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }
  }
}
