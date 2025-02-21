"use client";

import type { urlRouter } from "@/server/api/routers/url";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { api } from "@/trpc/react";

export function UrlView(
  url: Readonly<
    inferRouterOutputs<typeof urlRouter>["getAllPaginated"]["items"][number]
  >,
) {
  const { data } = api.url.getAnalytics.useQuery({ urlId: url.id });
  return (
    <Link href={url.destination} target="_blank">
      <li>{url.destination}</li>
      <span>{JSON.stringify(data?.data)}</span>
    </Link>
  );
}
