"use server";

import AuthError from "next-auth";
import { hash } from "bcryptjs";

import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { signInSchema, signUpSchema } from "@/lib/zod/schemas";
import type { ActionResult } from "@/lib/action-result";

function normalizeNextPath(input?: string) {
  if (!input || !input.startsWith("/")) return "/courses";
  if (input.startsWith("//")) return "/courses";
  return input;
}

function createHandleBase(email: string, name: string) {
  const source = (name || email.split("@")[0]).toLowerCase();
  const normalized = source
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

  return normalized || "learner";
}

async function createUniqueHandle(base: string) {
  let candidate = base;
  let index = 1;

  while (await db.user.findUnique({ where: { handle: candidate } })) {
    index += 1;
    candidate = `${base}-${index}`;
  }

  return candidate;
}

export async function signUpWithCredentials(input: {
  email: string;
  name: string;
  password: string;
}): Promise<ActionResult<{ created: true }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please enter a valid name, email, and password.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const handleBase = createHandleBase(email, parsed.data.name);
  const handle = await createUniqueHandle(handleBase);

  await db.user.create({
    data: {
      email,
      name: parsed.data.name,
      handle,
      passwordHash,
    },
  });

  return { ok: true, data: { created: true } };
}

export async function signInWithCredentials(input: {
  email: string;
  password: string;
  nextPath?: string;
}): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Email or password is invalid." };
  }

  const redirectTo = normalizeNextPath(parsed.data.nextPath);

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    });

    return { ok: true, data: { redirectTo } };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Invalid email or password." };
    }

    return { ok: false, error: "Could not sign in. Please try again." };
  }
}

export async function signInWithGoogle(nextPath?: string) {
  await signIn("google", { redirectTo: normalizeNextPath(nextPath) });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
