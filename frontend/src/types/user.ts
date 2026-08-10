export type UserRole = "DEVELOPER" | "TESTER" | "MANAGER";


export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
}