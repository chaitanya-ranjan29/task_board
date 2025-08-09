import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/data";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Get user from JSON file
  const user = db.findUserByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT token
  const token = generateToken(user.id);

  return NextResponse.json({ token });
}
