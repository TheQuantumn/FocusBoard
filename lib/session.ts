import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const SESSION_DURATION_DAYS = 7;

export async function createSession(userId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await prisma.session.create({
    data: {
      id: randomUUID(),
      userId,
      expiresAt,
    },
  });

  return session;
}

export async function getSession(sessionId: string) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.session.delete({
    where: { id: sessionId },
  });
}
