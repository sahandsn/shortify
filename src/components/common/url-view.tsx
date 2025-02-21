"use client";

import type { urlRouter } from "@/server/api/routers/url";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { H3 } from "../ui/typography";
import { CheckCheck, Copy, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@mantine/hooks";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { UrlDelete } from "./url-delete";
import { UrlEdit } from "./url-edit";

export function UrlView(
  url: Readonly<
    inferRouterOutputs<typeof urlRouter>["getAllPaginated"]["items"][number]
  >,
) {
  const clipboard = useClipboard({ timeout: 1000 });
  const { data, isError, error, isFetching } = api.url.getAnalytics.useQuery({
    urlId: url.id,
  });
  const utils = api.useUtils();

  const chartData =
    data?.data?.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
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
              /{url.destination}
            </Link>
          </H3>
          <section className="flex gap-1">
            <section>
              <Button
                variant="ghost"
                onClick={async () => {
                  await utils.url.getAnalytics.invalidate({ urlId: url.id });
                }}
              >
                <RefreshCcw className={cn({ "animate-spin": isFetching })} />
                {totalCount} click(s)
              </Button>
            </section>

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
              <UrlEdit {...url} />
              <UrlDelete {...url} />
            </section>
          </section>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {isError ? (
            <p>Error loading analytics: {error.message}</p>
          ) : (
            <ChartContainer
              config={{
                count: {
                  label: "Clicks",
                  color: "cyan",
                },
              }}
              className="m-auto h-[200px] w-full"
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
                  allowDecimals={false}
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
          )}
        </div>

        <section className="space-y-2 text-sm text-muted-foreground">
          <p>{url.source}</p>
          <section className="flex flex-wrap justify-between gap-2">
            <p>{url.description}</p>

            <p className="ms-auto">
              {new Date(url.createdAt).toLocaleDateString()}
            </p>
          </section>
        </section>
      </CardContent>
    </Card>
  );
}
