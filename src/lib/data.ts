import fs from "fs";
import path from "path";

export type User = {
  id: string;
  username: string;
  password: string;
};

export type Board = {
  id: string;
  userId: string;
  name: string;
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

// Path to data file
const dataFilePath = path.join(process.cwd(), "data.json");

// Read data from file or initialize empty
function readData(): DataType {
  if (!fs.existsSync(dataFilePath)) {
    const initialData: DataType = { users: [], boards: [], tasks: [] };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const raw = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(raw) as DataType;
}

// Write data to file
function writeData(data: DataType) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// DB helper functions
export const db = {
  getAll: (): DataType => readData(),

  saveAll: (data: DataType) => writeData(data),

  // Users
  addUser: (user: User) => {
    const data = readData();
    data.users.push(user);
    writeData(data);
  },
  findUserByUsername: (username: string) => {
    const data = readData();
    return data.users.find((u) => u.username === username);
  },
  findUserById: (id: string) => {
    const data = readData();
    return data.users.find((u) => u.id === id);
  },

  // Boards
  addBoard: (board: Board) => {
    const data = readData();
    data.boards.push(board);
    writeData(data);
  },
  getBoardsByUser: (userId: string) => {
    const data = readData();
    return data.boards.filter((b) => b.userId === userId);
  },
  updateBoard: (boardId: string, name: string) => {
    const data = readData();
    const board = data.boards.find((b) => b.id === boardId);
    if (board) {
      board.name = name;
      writeData(data);
    }
  },
  deleteBoard: (boardId: string) => {
    const data = readData();
    data.boards = data.boards.filter((b) => b.id !== boardId);
    data.tasks = data.tasks.filter((t) => t.boardId !== boardId); // remove related tasks
    writeData(data);
  },

  // Tasks
  addTask: (task: Task) => {
    const data = readData();
    data.tasks.push(task);
    writeData(data);
  },
  getTasksByBoard: (boardId: string) => {
    const data = readData();
    return data.tasks.filter((t) => t.boardId === boardId);
  },

  getTask: (taskId: string) => {
    const data = db.getAll();
    return data.tasks.find((t) => t.id === taskId);
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const data = db.getAll();
    const index = data.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return undefined;

    data.tasks[index] = { ...data.tasks[index], ...updates };
    db.saveAll(data);
    return data.tasks[index];
  },

  deleteTask: (taskId: string) => {
    const data = readData();
    data.tasks = data.tasks.filter((t) => t.id !== taskId);
    writeData(data);
  },
};
