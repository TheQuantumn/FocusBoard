import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const DEFAULT_STUDY = 25;
const DEFAULT_BREAK = 5;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let settings = await prisma.pomodoroSettings.findUnique({
    where: { userId: user.id },
  });

  // Auto-create defaults if missing
  if (!settings) {
    settings = await prisma.pomodoroSettings.create({
      data: {
        userId: user.id,
        studyTime: DEFAULT_STUDY,
        breakTime: DEFAULT_BREAK,
      },
    });
  }

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { studyTime, breakTime } = body;

  if (
    typeof studyTime !== "number" ||
    typeof breakTime !== "number" ||
    studyTime <= 0 ||
    breakTime <= 0
  ) {
    return NextResponse.json(
      { error: "Invalid study/break time" },
      { status: 400 }
    );
  }

  const settings = await prisma.pomodoroSettings.upsert({
    where: { userId: user.id },
    update: { studyTime, breakTime },
    create: {
      userId: user.id,
      studyTime,
      breakTime,
    },
  });

  return NextResponse.json(settings);
}
