import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Credential {
  id: string;
  name: string;
  value: string;
  service: string;
  createdAt: Date;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface SettingsState {
  // Workspace
  workspaceName: string;
  emailNotifications: boolean;
  updateSettings: (settings: { workspaceName?: string; emailNotifications?: boolean }) => void;

  // Profile
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Credentials
  credentials: Credential[];
  addCredential: (credential: Credential) => void;
  removeCredential: (id: string) => void;

  // Notifications (Local only)
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  userProfile: {
    name: "Demo User",
    email: "user@flowforge.app",
    avatar: "",
  },
  workspaceName: "My Workspace",
  emailNotifications: true,
  credentials: [],
  notifications: [],

  updateSettings: (settings) =>
    set((state) => ({ ...state, ...settings })),

  updateProfile: (updates) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates },
    })),

  addCredential: (credential) =>
    set((state) => ({
      credentials: [...state.credentials, credential],
    })),

  removeCredential: (id) =>
    set((state) => ({
      credentials: state.credentials.filter((c) => c.id !== id),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
