import { z } from "zod";

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
});
