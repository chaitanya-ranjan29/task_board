import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const { title, description, status, dueDate } = await req.json();

  // Find task
  const task = await db.getTask(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Check if board belongs to the user
  const boards = await db.getBoardsByUser(userId);
  const board = boards.find((b) => b.id === task.boardId);
  if (!board) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Update task
  const updatedTask = await db.updateTask(id, {
    title,
    description,
    status,
    dueDate,
  });

  return NextResponse.json(updatedTask);
});

export const DELETE = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;

  // Find task
  const task = await db.getTask(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Check if board belongs to the user
  const boards = await db.getBoardsByUser(userId);
  const board = boards.find((b) => b.id === task.boardId);
  if (!board) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await db.deleteTask(id);

  return NextResponse.json({ message: "Task deleted" });
});
