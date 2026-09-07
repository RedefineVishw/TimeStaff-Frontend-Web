export interface Project {
  id: string;
  name: string;
  color: string | null;
  totalSeconds: number;
  tasks: TaskSummary[];
}

export interface TaskSummary {
  id: string;
  name: string;
  totalSeconds: number;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  source: "web" | "desktop";
  task: {
    id: string;
    name: string;
    project: {
      id: string;
      name: string;
      color: string | null;
    };
  };
}
