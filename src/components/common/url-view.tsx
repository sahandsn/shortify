"use client";

import type { urlRouter } from "@/server/api/routers/url";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; // Assuming Shadcn Chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"; // Fallback if Shadcn Chart isn’t available
import { H3, P, Small } from "../ui/typography";
import { ChartNoAxesCombined, CheckCheck, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@mantine/hooks";
import { env } from "@/env";

export function UrlView(
  url: Readonly<
    inferRouterOutputs<typeof urlRouter>["getAllPaginated"]["items"][number]
  >,
) {
  const clipboard = useClipboard({ timeout: 1000 });
  const { data, isError, error } = api.url.getAnalytics.useQuery({
    urlId: url.id,
  });

  if (isError) {
    console.error(error);
    return <div>Error loading analytics: {error.message}</div>;
  }

  // Prepare chart data (transform `data.data` if needed)
  const chartData =
    data?.data?.map((item) => ({
      date: new Date(item.date).toLocaleDateString(), // Format date for readability
      count: item.count,
    })) ?? [];
  const totalCount = chartData.reduce((total, current) => {
    return total + current.count;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between">
          <H3>
            <Link href={url.destination} target="_blank">
              <span className="text-muted-foreground">/</span>
              {url.destination}
            </Link>
          </H3>
          <section className="flex gap-1">
            <Button variant="ghost">
              <ChartNoAxesCombined />
              {totalCount} click(s)
            </Button>

            <Separator orientation="vertical" className="m-auto h-4" />
            <section>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  clipboard.copy(
                    new URL(url.destination, env.NEXT_PUBLIC_BASE_PATH),
                  );
                }}
              >
                {clipboard.copied ? <CheckCheck /> : <Copy />}
              </Button>
            </section>
          </section>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <div className="mt-4">
          <ChartContainer
            config={{
              count: {
                label: "Clicks",
                color: "cyan",
              },
            }}
            className="h-[200px] w-full"
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="date"
                type="category"
                stroke="#fff"
                tick={{ fill: "#fff" }}
              />
              <YAxis
                dataKey="count"
                type="number"
                stroke="#fff"
                tick={{ fill: "#fff" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="cyan"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div> */}

        <section className="space-y-2 text-sm text-muted-foreground">
          <p>{url.source}</p>
          <section className="flex flex-wrap justify-between gap-2">
            <p>{url.description}</p>

            <p>{new Date(url.createdAt).toLocaleDateString()}</p>
          </section>
        </section>
      </CardContent>
    </Card>
  );
}
