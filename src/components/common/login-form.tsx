import { signIn } from "@/server/auth";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
                onClick={async () => {
                  "use server";
                  await signIn("discord", { redirectTo: "/dashboard" });
                }}
              >
                <Image
                  alt="discord"
                  src="/discord.svg"
                  width={20}
                  height={20}
                />
                Login with Discord
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
