import { z } from 'zod'

export const updateBlogSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(3).max(255).optional(),
  tags: z.array(z.string()).optional(),
})

export type UpdateBlogSchema = z.infer<typeof updateBlogSchema>
