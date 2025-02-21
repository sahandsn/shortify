import { z } from "zod";

export const createGenericSchema = z.object({
  source: z.string().url(),
  description: z.string().optional(),
});
