import { Dashboard } from "@/components/module/dashboard";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user) {
    void api.url.getAllPaginated.prefetch({ page: 1 });
  }
  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
