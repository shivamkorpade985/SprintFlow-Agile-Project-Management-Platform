import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { getItem, setItem } from "../../../storage/localStorage";
import { seedUsers } from "./seedUsers";

export function initializeTeamData(): void {
  const existingUsers =
    getItem(STORAGE_KEYS.USERS);

  if (existingUsers === null) {
    setItem(STORAGE_KEYS.USERS, seedUsers);
  }
}