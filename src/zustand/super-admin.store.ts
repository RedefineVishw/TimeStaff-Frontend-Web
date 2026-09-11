import { create } from "zustand";
import type { SuperAdmin } from "@/services/super-admin.service";

interface SuperAdminState {
  // In-memory only. No refresh endpoint exists for Super Admin (separate,
  // intentionally simpler auth system) — a hard refresh just means logging
  // back in, which is an acceptable tradeoff for how rarely this is used.
  accessToken: string | null;
  superAdmin: SuperAdmin | null;
  setSession: (accessToken: string, superAdmin: SuperAdmin) => void;
  logout: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  accessToken: null,
  superAdmin: null,
  setSession: (accessToken, superAdmin) => set({ accessToken, superAdmin }),
  logout: () => set({ accessToken: null, superAdmin: null }),
}));
