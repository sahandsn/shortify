import { auth, signIn } from "@/server/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) {
    await signIn(undefined, { redirectTo: "/dashboard" });
  } else {
    return children;
  }
}
