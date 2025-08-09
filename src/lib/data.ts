export const users: {
  id: string;
  username: string;
  passwordHash: string;
}[] = [];

export const boards: {
  id: string;
  userId: string;
  title: string;
}[] = [];

export const tasks: {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: "pending" | "completed" | string;
  dueDate?: string;
  createdAt: string;
  order: number;
}[] = [];
