import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import { withAuth } from "@/lib/withAuth";
import { v4 as uuid } from "uuid";

// GET: Fetch all boards for the logged-in user
export const GET = withAuth(async (userId) => {
  const userBoards = db.getBoardsByUser(userId);
  return NextResponse.json(userBoards);
});

// POST: Create a new board for the logged-in user
export const POST = withAuth(async (userId, req: NextRequest) => {
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const newBoard = { id: uuid(), userId, name: title };
  db.addBoard(newBoard);

  return NextResponse.json(newBoard, { status: 201 });
});
