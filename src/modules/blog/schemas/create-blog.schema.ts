import { z } from 'zod'

export const createBlogSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(3).max(255),
  tags: z.array(z.string()),
})

export type CreateBlogSchema = z.infer<typeof createBlogSchema>
