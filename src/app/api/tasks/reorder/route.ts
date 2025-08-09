import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const { boardId, orderedTaskIds } = await req.json();

  const boardTasks = tasks.filter((t) => t.boardId === boardId);
  if (boardTasks.length !== orderedTaskIds.length) {
    return NextResponse.json({ error: "Invalid task list" }, { status: 400 });
  }

  orderedTaskIds.forEach((taskId: string, index: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) task.order = index;
  });

  return NextResponse.json({ message: "Tasks reordered successfully" });
});
