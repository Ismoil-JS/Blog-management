import { z } from 'zod'

export const commentParamsDtoSchema = z.object({
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

export type CommentParamsDto = z.infer<typeof commentParamsDtoSchema>
