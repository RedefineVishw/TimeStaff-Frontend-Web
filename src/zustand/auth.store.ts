import { create } from "zustand";

interface AuthState {
  // In-memory only, deliberately not persisted — if it's gone after a hard
  // refresh, the response interceptor re-acquires it via the httpOnly
  // refresh-token cookie automatically. Nothing sensitive ever touches storage.
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
}));
