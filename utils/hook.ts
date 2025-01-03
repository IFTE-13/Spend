import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return;
}