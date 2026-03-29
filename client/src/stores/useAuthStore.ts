import { create } from "zustand";
import type { User } from "@/types/user";
import { authApi } from "@/api/auth";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  userName: string;
}

interface UpdateUserData {
  userName?: string;
  email?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  isAuthenticated: boolean;

  initAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
  loginUser: (data: LoginData) => Promise<void>;
  registerUser: (data: RegisterData) => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteUser: () => Promise<void>;
  updateUserInfo: (data: UpdateUserData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isSyncing: false,
  loading: true,
  isAuthenticated: false,

  initAuth: async () => {
    try {
      const userData = await authApi.getMe();
      set({ user: userData, isAuthenticated: !!userData });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ isSyncing: true });
    try {
      const userData = await authApi.getMe();
      set({ user: userData });
    } finally {
      set({ isSyncing: false });
    }
  },

  loginUser: async (data) => {
    const { user } = await authApi.login(data);
    set({ user, isAuthenticated: true });
  },

  registerUser: async (data) => {
    const { user } = await authApi.register(data);
    set({ user, isAuthenticated: true });
  },

  logoutUser: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  deleteUser: async () => {
    await authApi.deleteMe();
    get().logoutUser();
  },

  updateUserInfo: async (data) => {
    const oldUser = get().user;
    if (oldUser) set({ user: { ...oldUser, ...data } });

    try {
      const updatedUser = await authApi.updateMe(data);
      set({ user: updatedUser });
    } catch (err) {
      set({ user: oldUser });
      throw err;
    }
  },
}));
