import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const { title, description, status, dueDate } = await req.json();

  // Find task and ensure it belongs to a board owned by the user
  const task = db.getTask(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const board = db.getBoardsByUser(userId).find((b) => b.id === task.boardId);
  if (!board) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updatedTask = db.updateTask(id, {
    title,
    description,
    status,
    dueDate,
  });

  return NextResponse.json(updatedTask);
});

export const DELETE = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;

  // Find task and ensure it belongs to a board owned by the user
  const task = db.getTask(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const board = db.getBoardsByUser(userId).find((b) => b.id === task.boardId);
  if (!board) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  db.deleteTask(id);

  return NextResponse.json({ message: "Task deleted" });
});
