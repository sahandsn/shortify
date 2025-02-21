import { z } from "zod";

export const createGenericSchema = z.object({
  source: z.string().url(),
  description: z.string().optional(),
});

export const editGenericSchema = createGenericSchema.extend({
  id: z.string(),
});
