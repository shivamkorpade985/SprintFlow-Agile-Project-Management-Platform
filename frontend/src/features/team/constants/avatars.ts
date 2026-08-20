/**
 * Avatar Presets & Color Constants
 *
 * Defines the 6 vibrant background color themes available for user avatars across SprintFlow.
 */
export interface AvatarOption {
  id: string;
  label: string;
  color: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "blue", label: "Ocean Blue", color: "#1E64D4" },
  { id: "purple", label: "Royal Purple", color: "#7C3AED" },
  { id: "amber", label: "Warm Amber", color: "#D97706" },
  { id: "emerald", label: "Emerald Green", color: "#059669" },
  { id: "coral", label: "Coral Red", color: "#E11D48" },
  { id: "indigo", label: "Deep Indigo", color: "#4F46E5" },
];
