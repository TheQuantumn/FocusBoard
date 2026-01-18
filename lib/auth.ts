import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function getCurrentUser() {
  const sessionId = (await cookies()).get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  return session.user;
}
