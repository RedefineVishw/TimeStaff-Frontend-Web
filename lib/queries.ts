import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Project, TimeEntry } from "./types";

const FIVE_MINUTES = 5 * 60 * 1000;

// --- Projects -------------------------------------------------------------

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get<Project[]>("/projects")).data,
    refetchInterval: FIVE_MINUTES,
  });
}

// --- Time entries -------------------------------------------------------------
// No start/stop timer hooks here on purpose — starting/stopping the timer is
// the desktop app's job (OS-level tracking lives there). The web app only
// ever views and edits time that's already been logged.

export function useTimeEntries(taskId?: string) {
  return useQuery({
    queryKey: ["time-entries", taskId ?? "all"],
    queryFn: async () =>
      (await api.get<TimeEntry[]>("/time-entries", { params: taskId ? { taskId } : undefined }))
        .data,
  });
}

export interface CreateTimeEntryInput {
  taskId: string;
  startedAt: string;
  endedAt: string;
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTimeEntryInput) =>
      (await api.post<TimeEntry>("/time-entries", input)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export interface UpdateTimeEntryInput {
  id: string;
  startedAt?: string;
  endedAt?: string;
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateTimeEntryInput) =>
      (await api.patch<TimeEntry>(`/time-entries/${id}`, body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/time-entries/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// --- Settings -------------------------------------------------------------
// Single global config row (no per-user auth yet). The desktop app reads
// idleTimeoutMinutes to decide how long with no input before it auto-stops
// the running timer and discards that idle stretch.

export interface AppSettings {
  id: string;
  idleTimeoutMinutes: number;
  updatedAt: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get<AppSettings>("/settings")).data,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idleTimeoutMinutes: number) =>
      (await api.patch<AppSettings>("/settings", { idleTimeoutMinutes })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
