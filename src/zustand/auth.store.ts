import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  role: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    status: "ONBOARDING" | "ACTIVE" | "SUSPENDED";
  } | null;
}

interface AuthState {
  // In-memory only, deliberately not persisted — if it's gone after a hard
  // refresh, the response interceptor re-acquires it via the httpOnly
  // refresh-token cookie automatically. Nothing sensitive ever touches storage.
  accessToken: string | null;
  user: AuthUser | null;
  // False until the app has attempted one silent refresh + GET /auth/me on
  // load — route guards must wait for this before deciding to redirect,
  // otherwise every hard refresh would bounce a real logged-in user to /login.
  isHydrated: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isHydrated: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setHydrated: () => set({ isHydrated: true }),
  logout: () => set({ accessToken: null, user: null }),
}));
