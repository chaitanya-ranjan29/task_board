import { NextRequest, NextResponse } from "next/server";
import { boards } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";

export const PUT = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const { title } = await req.json();

  const board = boards.find((b) => b.id === id && b.userId === userId);
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  board.title = title;
  return NextResponse.json(board);
});

export const DELETE = withAuth(async (userId, req: NextRequest) => {
  const id = req.url.split("/").pop()!;
  const index = boards.findIndex((b) => b.id === id && b.userId === userId);
  if (index === -1) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  boards.splice(index, 1);
  return NextResponse.json({ message: "Board deleted" });
});
