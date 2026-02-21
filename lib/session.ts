import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { USER_COOKIE_KEY } from "@/lib/constants";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE_KEY)?.value;

  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Create your profile handle first.");
  }
  return user;
}
