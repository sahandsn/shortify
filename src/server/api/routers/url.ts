import { z } from "zod";
import { eq, count, and, ilike, or } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { urlAnalytics, urls } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { createGenericSchema, editGenericSchema } from "@/schema/url";

export const urlRouter = createTRPCRouter({
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const url = await ctx.db.query.urls.findFirst({
      orderBy: (urls, { desc }) => [desc(urls.createdAt)],
    });

    return url ?? null;
  }),

  createGeneric: protectedProcedure
    .input(createGenericSchema)
    .mutation(async ({ ctx, input }) => {
      const createdUrls = await ctx.db
        .insert(urls)
        .values({
          source: input.source,
          userId: ctx.session.user.id,
          description: input.description,
        })
        .returning();
      if (createdUrls.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL was not added",
        });
      }
      return { rows: createdUrls, message: "URL added successfully!" };
    }),
  editGeneric: protectedProcedure
    .input(editGenericSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUrl = await ctx.db.query.urls.findFirst({
        where: (urls, { and, eq }) =>
          and(eq(urls.id, input.id), eq(urls.userId, ctx.session.user.id)),
      });

      if (!existingUrl) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL not found or you don't have permission to edit it",
        });
      }

      const [updatedUrl] = await ctx.db
        .update(urls)
        .set({
          source: input.source,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(and(eq(urls.id, input.id), eq(urls.userId, ctx.session.user.id)))
        .returning();

      if (!updatedUrl) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update URL",
        });
      }

      return {
        row: updatedUrl,
        message: "URL updated successfully!",
      };
    }),
  deleteGeneric: protectedProcedure
    .input(
      z.object({
        urlId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedUrls = await ctx.db
        .delete(urls)
        .where(eq(urls.id, input.urlId))
        .returning();

      if (deletedUrls.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL with this ID does not exist",
        });
      }
      return { deletedUrls, message: "URL deleted successfully!" };
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
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 4;
      const offset = (input.page - 1) * limit;

      const searchConditions = input.query
        ? or(
            ilike(urls.source, `%${input.query}%`),
            ilike(urls.description, `%${input.query}%`),
          )
        : undefined;

      const [items, totalCountResult] = await Promise.all([
        ctx.db.query.urls.findMany({
          where: and(eq(urls.userId, ctx.session.user.id), searchConditions),
          orderBy: (urls, { desc }) => [desc(urls.createdAt)],
          offset,
          limit,
        }),
        ctx.db
          .select({ count: count() })
          .from(urls)
          .where(and(eq(urls.userId, ctx.session.user.id), searchConditions)),
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
