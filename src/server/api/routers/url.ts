import { z } from "zod";
import { eq, count } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { urls } from "@/server/db/schema";

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
});
