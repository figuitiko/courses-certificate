"use server";

import { randomUUID } from "crypto";
import { PointSourceType, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { pointsAdjustSchema } from "@/lib/zod/schemas";
import type { ActionResult } from "@/lib/action-result";

type AwardPointInput = {
  userId: string;
  sourceType: PointSourceType;
  sourceId: string;
  points: number;
  note?: string;
};

export async function awardPointsOnce(input: AwardPointInput) {
  try {
    await db.$transaction(async (tx) => {
      await tx.pointsLedger.create({
        data: {
          userId: input.userId,
          sourceType: input.sourceType,
          sourceId: input.sourceId,
          points: input.points,
          note: input.note
        }
      });

      await tx.user.update({
        where: { id: input.userId },
        data: {
          totalPoints: {
            increment: input.points
          }
        }
      });
    });

    return { ok: true as const };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: true as const };
    }
    return { ok: false as const, error: "Unable to award points." };
  }
}

export async function getUserPoints({ userId }: { userId: string }) {
  const [user, ledger] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { id: true, totalPoints: true, handle: true, name: true } }),
    db.pointsLedger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100
    })
  ]);

  return {
    totalPoints: user?.totalPoints ?? 0,
    user,
    ledger
  };
}

export async function adjustUserPoints(input: {
  userId: string;
  points: number;
  note: string;
}): Promise<ActionResult<{ totalPoints: number }>> {
  const parsed = pointsAdjustSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid point adjustment.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const award = await awardPointsOnce({
    userId: parsed.data.userId,
    sourceType: PointSourceType.ADMIN_ADJUST,
    sourceId: `adjust:${randomUUID()}`,
    points: parsed.data.points,
    note: parsed.data.note
  });

  if (!award.ok) {
    return { ok: false, error: award.error ?? "Could not adjust points." };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data.userId }, select: { totalPoints: true } });
  return { ok: true, data: { totalPoints: user?.totalPoints ?? 0 } };
}
