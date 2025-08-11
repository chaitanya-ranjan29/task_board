import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const { boardId, orderedTaskIds } = await req.json();

  if (!boardId || !Array.isArray(orderedTaskIds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Check board ownership
  const boards = await db.getBoardsByUser(userId);
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Get tasks for this board
  const allTasks = await db.getAll();
  const boardTasks = allTasks.tasks.filter((t) => t.boardId === boardId);

  if (boardTasks.length !== orderedTaskIds.length) {
    return NextResponse.json({ error: "Invalid task list" }, { status: 400 });
  }

  // Reorder tasks in Redis
  for (let index = 0; index < orderedTaskIds.length; index++) {
    const taskId = orderedTaskIds[index];
    const task = boardTasks.find((t) => t.id === taskId);
    if (task) {
      await db.updateTask(taskId, { order: index });
    }
  }

  return NextResponse.json({ message: "Tasks reordered successfully" });
});
