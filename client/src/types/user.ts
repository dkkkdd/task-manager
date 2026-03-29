export type User = {
  id: string;
  email: string;
  userName?: string;
  createdAt: string;
  _count: { tasks: number; projects: number };
};
