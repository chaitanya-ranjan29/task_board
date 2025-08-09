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
  const board = db.getBoardsByUser(userId).find((b) => b.id === boardId);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const boardTasks = db
    .getTasksByBoard(boardId)
    .sort((a, b) => a.order - b.order);

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
  const board = db.getBoardsByUser(userId).find((b) => b.id === boardId);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const order = db.getTasksByBoard(boardId).length;

  const newTask = {
    id: uuid(),
    boardId,
    title,
    description,
    status: "pending",
    dueDate,
    createdAt: new Date().toISOString(),
    order,
  };

  db.addTask(newTask);

  return NextResponse.json(newTask, { status: 201 });
});
