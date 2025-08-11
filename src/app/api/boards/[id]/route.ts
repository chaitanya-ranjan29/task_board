import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const { title } = await req.json();

  // Check if board exists and belongs to the user
  const userBoards = await db.getBoardsByUser(userId);
  const board = userBoards.find((b) => b.id === id);

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Update board
  await db.updateBoard(id, title);

  return NextResponse.json({ ...board, title });
});

export const DELETE = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;

  // Check if board exists and belongs to the user
  const userBoards = await db.getBoardsByUser(userId);
  const board = userBoards.find((b) => b.id === id);

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Delete board (also removes its tasks)
  await db.deleteBoard(id);

  return NextResponse.json({ message: "Board deleted" });
});
