"use server";

import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { ADMIN_COOKIE_KEY, USER_COOKIE_KEY } from "@/lib/constants";
import { userProfileSchema } from "@/lib/zod/schemas";
import type { ActionResult } from "@/lib/action-result";

export async function createOrGetUser(input: {
  email?: string;
  name?: string;
  handle: string;
}): Promise<ActionResult<{ userId: string }>> {
  const parsed = userProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Profile data is invalid.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const data = parsed.data;

  try {
    const existingByHandle = await db.user.findUnique({
      where: { handle: data.handle }
    });

    const user =
      existingByHandle ??
      (await db.user.create({
        data: {
          handle: data.handle,
          email: data.email || null,
          name: data.name || null
        }
      }));

    const cookieStore = await cookies();
    cookieStore.set(USER_COOKIE_KEY, user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return { ok: true, data: { userId: user.id } };
  } catch {
    return { ok: false, error: "Unable to create profile. Try a different handle." };
  }
}

export async function setAdminMode(enabled: boolean): Promise<ActionResult<{ enabled: boolean }>> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_KEY, enabled ? "true" : "false", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return {
    ok: true,
    data: { enabled }
  };
}
