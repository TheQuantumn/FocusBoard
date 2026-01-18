import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";

export async function POST() {
  const sessionId = (await cookies()).get("session")?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: "session",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
