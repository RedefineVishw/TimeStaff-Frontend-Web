import { create } from "zustand";

export type RunningEntry = {
  id: string;
  taskId: string;
  taskName: string;
  projectName: string;
  startedAt: string;
  durationSeconds: number;
};

interface TimerState {
  running: RunningEntry | null;
  setRunning: (entry: RunningEntry | null) => void;
  tickLocally: () => void;
}

// Holds the currently-running timer client-side so the UI can tick every
// second without hitting the API each render — the 5-minute poll (or a
// manual refetch after start/stop) is what keeps this in sync with the server.
export const useTimerStore = create<TimerState>((set) => ({
  running: null,
  setRunning: (entry) => set({ running: entry }),
  tickLocally: () =>
    set((state) =>
      state.running
        ? { running: { ...state.running, durationSeconds: state.running.durationSeconds + 1 } }
        : state,
    ),
}));
