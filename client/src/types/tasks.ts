export interface Task {
  id: string;
  title: string;
  isDone: boolean;
  priority: number;

  parentId?: string | null;
  comment: string | null;
  deadline: Date | null;
  reminderAt?: string | null;
  projectId?: string | null;
  completedAt: Date | null;
  subtasks?: Task[];
  sectionId?: string | null;
  _count?: { tasks: number };
}
