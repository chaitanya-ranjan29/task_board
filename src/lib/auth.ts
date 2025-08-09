import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  return token ? verifyToken(token) : null;
}
