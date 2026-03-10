import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === adminPassword;
}
