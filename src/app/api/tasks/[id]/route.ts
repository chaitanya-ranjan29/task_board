import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const { title, description, status, dueDate } = await req.json();

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;

  return NextResponse.json(task);
});

export const DELETE = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  tasks.splice(index, 1);
  return NextResponse.json({ message: "Task deleted" });
});
