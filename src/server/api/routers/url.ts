import { z } from "zod";
import { eq, count } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { urlAnalytics, urls } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const urlRouter = createTRPCRouter({
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const url = await ctx.db.query.urls.findFirst({
      orderBy: (urls, { desc }) => [desc(urls.createdAt)],
    });

    return url ?? null;
  }),

  createGeneric: protectedProcedure
    .input(z.object({ source: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(urls).values({
        source: input.source,
        userId: ctx.session.user.id,
      });
    }),

  createAnalytics: protectedProcedure
    .input(z.object({ destination: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = await ctx.db.query.urls.findFirst({
        where: eq(urls.destination, input.destination),
      });

      if (!url) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL not found",
        });
      }

      await ctx.db.insert(urlAnalytics).values({
        urlId: url.id,
      });

      return url;
    }),

  getAllPaginated: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 6;
      const offset = (input.page - 1) * limit;

      // Get paginated URLs for current user
      const [items, totalCountResult] = await Promise.all([
        ctx.db.query.urls.findMany({
          where: eq(urls.userId, ctx.session.user.id),
          orderBy: (urls, { desc }) => [desc(urls.createdAt)],
          offset,
          limit: limit,
        }),
        ctx.db
          .select({ count: count() })
          .from(urls)
          .where(eq(urls.userId, ctx.session.user.id)),
      ]);
      const totalCount = totalCountResult[0]?.count ?? 0;

      return {
        items,
        pagination: {
          currentPage: input.page,
          itemsPerPage: limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  getAnalytics: protectedProcedure
    .input(z.object({ urlId: z.string() }))
    .query(async ({ ctx, input }) => {
      const url = await ctx.db.query.urls.findFirst({
        where: (urls, { eq, and }) =>
          and(eq(urls.id, input.urlId), eq(urls.userId, ctx.session.user.id)),
        with: {
          urlAnalytics: true,
        },
      });

      if (!url) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL not found",
        });
      }

      const data = await ctx.db.query.urlAnalytics
        .findMany({
          where: eq(urlAnalytics.urlId, input.urlId),
          orderBy: (urlAnalytics, { desc }) => [desc(urlAnalytics.timestamp)],
        })
        .then((analytics) => {
          return analytics.reduce(
            (acc, analytic) => {
              const date = new Date(analytic.timestamp);
              const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              acc[key] = acc[key] ?? 0;
              acc[key] += 1;
              return acc;
            },
            {} as Record<string, number>,
          );
        })
        .then((data) => {
          return Object.entries(data)
            .map(([date, count]) => ({
              date,
              count,
            }))
            .sort((a, b) => {
              return a.date.localeCompare(b.date);
            });
        });
      return {
        data,
      };
    }),
});
