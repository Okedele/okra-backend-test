import { z } from "zod";

export const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 1))
    .refine((value) => value > 0, {
      message: "page must be a positive number",
    }),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 10))
    .refine((value) => value > 0, {
      message: "limit must be a positive number",
    }),
  sort: z.string().optional().default("createdAt"),
  order: z
    .string()
    .optional()
    .default("desc")
    .refine((value) => ["asc", "desc"].includes(value), {
      message: "order must be 'asc' or 'desc'",
    }),
});

export const userStatsQuerySchema = z.object({
  minAge: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "minAge must be a positive integer.",
    }),
  maxAge: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "maxAge must be a positive integer.",
    }),
  city: z.string().optional(),
});
