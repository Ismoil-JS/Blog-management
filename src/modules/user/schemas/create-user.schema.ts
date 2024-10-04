import { z } from 'zod'

export const userReqBodySchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().min(3).max(255).email(),
  password: z.string().min(3).max(255),
})

export type UserReqBodySchema = z.infer<typeof userReqBodySchema>
