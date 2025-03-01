"use server";

import type { credentialsSchema } from "@/schema/credential";
import { signIn } from "@/server/auth";
import type { z } from "zod";

export async function handleCredentialsLogin(
  values: z.infer<typeof credentialsSchema>,
) {
  await signIn("credentials", {
    ...values,
    redirectTo: "/dashboard",
  });
}

export async function handleDiscordLogin() {
  await signIn("discord", { redirectTo: "/dashboard" });
}
