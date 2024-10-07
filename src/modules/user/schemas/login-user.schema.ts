import { z } from 'zod'

export const userLoginReqBodySchema = z.object({
  email: z.string().min(3).max(255).email(),
  password: z.string().min(3).max(255),
})

export type UserLoginReqBodySchema = z.infer<typeof userLoginReqBodySchema>
