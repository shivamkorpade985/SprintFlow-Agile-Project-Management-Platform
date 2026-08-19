export type UserRole = "DEVELOPER" | "TESTER" | "MANAGER";

export interface User {
  id: number;
  name: string;
  avatar?: string;
  role: UserRole;
}