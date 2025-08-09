import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";
import { v4 as uuid } from "uuid";

export const GET = withAuth(async (userId, req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return NextResponse.json({ error: "boardId is required" }, { status: 400 });
  }

  const boardTasks = tasks
    .filter((t) => t.boardId === boardId)
    .sort((a, b) => a.order - b.order);

  return NextResponse.json(boardTasks);
});

export const POST = withAuth(async (userId, req: NextRequest) => {
  const { boardId, title, description, dueDate } = await req.json();

  if (!boardId || !title) {
    return NextResponse.json(
      { error: "boardId and title required" },
      { status: 400 }
    );
  }

  const order = tasks.filter((t) => t.boardId === boardId).length;

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

  tasks.push(newTask);
  console.log("task array: ", tasks);
  return NextResponse.json(newTask, { status: 201 });
});
