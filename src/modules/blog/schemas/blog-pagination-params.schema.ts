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
  title: z.string().optional(),
  sortBy: z
    .string()
    .optional()
    .default('created_at')
    .refine((value) => ['created_at', 'updated_at', 'title'].includes(value), {
      message: 'Invalid sortBy field',
    }),
  sortOrder: z
    .string()
    .optional()
    .default('DESC')
    .refine((value) => ['ASC', 'DESC'].includes(value), {
      message: 'Invalid sortOrder value',
    }),
})

export type BlogParamsDto = z.infer<typeof blogParamsDtoSchema>
