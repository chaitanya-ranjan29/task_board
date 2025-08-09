import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/data";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  console.log("users: ", users);

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken(user.id);

  return NextResponse.json({ token });
}
