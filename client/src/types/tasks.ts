export type Task = {
  id: string;
  title: string;
  isDone: boolean;
  priority: number;
  parentId?: string | null;
  comment: string | null;
  deadline: string | null;
  projectId?: string | null;
  completedAt: Date | null;
  subtasks?: Task[];
  sectionId?: string | null;
  _count?: { tasks: number };
};

export type TaskFormData = {
  title: string;
  comment: string;
  priority: number;
  projectId: string | null;
  deadline: string | null;
};
