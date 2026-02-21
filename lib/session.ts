import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must sign in first.");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required.");
  }
  return user;
}
