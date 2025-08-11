import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";
import { v4 as uuid } from "uuid";

// GET: Fetch tasks for a given board
export const GET = withAuth(async (userId, req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return NextResponse.json({ error: "boardId is required" }, { status: 400 });
  }

  // Check if board belongs to user
  const boards = await db.getBoardsByUser(userId);
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const boardTasks = (await db.getTasksByBoard(boardId)).sort(
    (a, b) => a.order - b.order
  );

  return NextResponse.json(boardTasks);
});

// POST: Create a new task in a given board
export const POST = withAuth(async (userId, req: NextRequest) => {
  const { boardId, title, description, dueDate } = await req.json();

  if (!boardId || !title) {
    return NextResponse.json(
      { error: "boardId and title required" },
      { status: 400 }
    );
  }

  // Check if board belongs to user
  const boards = await db.getBoardsByUser(userId);
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const tasks = await db.getTasksByBoard(boardId);
  const order = tasks.length;

  const newTask = {
    id: uuid(),
    boardId,
    title,
    description,
    status: "pending" as const,
    dueDate,
    createdAt: new Date().toISOString(),
    order,
  };

  await db.addTask(newTask);

  return NextResponse.json(newTask, { status: 201 });
});
