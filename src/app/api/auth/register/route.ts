import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if user already exists
  const existing = db.findUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Add user to JSON file
  db.addUser({
    id: uuid(),
    username,
    password: passwordHash,
  });

  return NextResponse.json({ message: "User registered successfully" });
}
