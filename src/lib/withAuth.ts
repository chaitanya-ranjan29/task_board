import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function withAuth(
  handler: (userId: string, req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(userId, req);
  };
}
