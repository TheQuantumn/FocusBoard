import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }



  const { title, description, status } = body;

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const data: any = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  if (status !== undefined) {
    if (!Object.values(TaskStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid task status" },
        { status: 400 }
      );
    }
    data.status = status as TaskStatus;
  }

  const updated = await prisma.task.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth check
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Unwrap async params (Next.js 16 requirement)
  const { id } = await params;

  // 3. Verify task ownership
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  // 4. Delete task
  await prisma.task.delete({
    where: { id },
  });

  // 5. Success response
  return NextResponse.json({ ok: true });
}
