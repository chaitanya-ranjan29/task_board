import { Redis } from "@upstash/redis";

export type User = {
  id: string;
  username: string;
  password: string;
};

export type Board = {
  id: string;
  userId: string;
  title: string;
};

export type Task = {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: "pending" | "completed" | string;
  dueDate?: string;
  createdAt: string;
  order: number;
};

type DataType = {
  users: User[];
  boards: Board[];
  tasks: Task[];
};

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Get entire dataset
async function readData(): Promise<DataType> {
  const data = await redis.get<DataType>("taskboard-data");
  if (!data) {
    const initialData: DataType = { users: [], boards: [], tasks: [] };
    await redis.set("taskboard-data", initialData);
    return initialData;
  }
  return data;
}

// Save dataset
async function writeData(data: DataType) {
  await redis.set("taskboard-data", data);
}

export const db = {
  getAll: async (): Promise<DataType> => readData(),

  saveAll: async (data: DataType) => writeData(data),

  // Users
  addUser: async (user: User) => {
    const data = await readData();
    data.users.push(user);
    await writeData(data);
  },

  findUserByUsername: async (username: string) => {
    const data = await readData();
    return data.users.find((u) => u.username === username);
  },

  findUserById: async (id: string) => {
    const data = await readData();
    return data.users.find((u) => u.id === id);
  },

  // Boards
  addBoard: async (board: Board) => {
    const data = await readData();
    data.boards.push(board);
    await writeData(data);
  },

  getBoardsByUser: async (userId: string) => {
    const data = await readData();
    return data.boards.filter((b) => b.userId === userId);
  },

  updateBoard: async (boardId: string, title: string) => {
    const data = await readData();
    const board = data.boards.find((b) => b.id === boardId);
    if (board) {
      board.title = title;
      await writeData(data);
    }
  },

  deleteBoard: async (boardId: string) => {
    const data = await readData();
    data.boards = data.boards.filter((b) => b.id !== boardId);
    data.tasks = data.tasks.filter((t) => t.boardId !== boardId);
    await writeData(data);
  },

  // Tasks
  addTask: async (task: Task) => {
    const data = await readData();
    data.tasks.push(task);
    await writeData(data);
  },

  getTasksByBoard: async (boardId: string) => {
    const data = await readData();
    return data.tasks.filter((t) => t.boardId === boardId);
  },

  getTask: async (taskId: string) => {
    const data = await readData();
    return data.tasks.find((t) => t.id === taskId);
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const data = await readData();
    const index = data.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return undefined;

    data.tasks[index] = { ...data.tasks[index], ...updates };
    await writeData(data);
    return data.tasks[index];
  },

  deleteTask: async (taskId: string) => {
    const data = await readData();
    data.tasks = data.tasks.filter((t) => t.id !== taskId);
    await writeData(data);
  },
};
