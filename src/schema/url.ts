import { z } from "zod";

export const createSchema = z.object({
  source: z.string().url(),
  description: z.string().optional(),
});

export const editSchema = createSchema.extend({
  id: z.string(),
});
