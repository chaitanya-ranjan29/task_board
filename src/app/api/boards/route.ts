import { NextRequest, NextResponse } from "next/server";
import { boards } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";
import { v4 as uuid } from "uuid";

export const GET = withAuth(async (userId) => {
  const userBoards = boards.filter((b) => b.userId === userId);
  return NextResponse.json(userBoards);
});

export const POST = withAuth(async (userId, req: NextRequest) => {
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const newBoard = { id: uuid(), userId, title };
  boards.push(newBoard);

  console.log("boards array: ", boards);
  return NextResponse.json(newBoard, { status: 201 });
});
