import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/data";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  console.log("username: ", { username, password });

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = users.find((u) => u.username === username);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ id: uuid(), username, passwordHash });

  return NextResponse.json({ message: "User registered successfully" });
}
