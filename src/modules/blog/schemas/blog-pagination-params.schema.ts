import { z } from 'zod'

export const blogParamsDtoSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().int().positive().optional()),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().int().positive().max(1000).optional()),
})

export type BlogParamsDto = z.infer<typeof blogParamsDtoSchema>
