import { z } from "zod";

export const noBodyValidator = {
  body: z.object({}).strict(),
};