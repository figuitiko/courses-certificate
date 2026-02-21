import { cookies } from "next/headers";

import { ADMIN_COOKIE_KEY } from "@/lib/constants";

export async function isAdminModeEnabled() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_KEY)?.value === "true";
}
