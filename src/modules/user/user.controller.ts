import { Router } from 'express'
import { UserService } from './user.service'
import {
  checkAlreadyExists,
  generateToken,
  validateReqBody,
} from '../../shared'
import { userLoginReqBodySchema, userReqBodySchema } from './schemas'
import { isUserExists } from '../../shared/middlewares/IsUserExist.middleware'

export const userRouter = Router()
const userService = new UserService()

userRouter.post(
  '/signup',
  checkAlreadyExists,
  validateReqBody(userReqBodySchema),
  async (req, res) => {
    const { username, email, password } = req.body
    const user = await userService.createUser({ username, email, password })
    return res.status(201).json({
      message: 'User created successfully',
      created_at: user.created_at,
    })
  },
)

userRouter.post(
  '/login',
  isUserExists,
  validateReqBody(userLoginReqBodySchema),
  async (req, res) => {
    const { email, password } = req.body
    const user = await userService.loginUser({ email, password })

    if (user) {
      const token = generateToken(user.id)
      return res.status(200).json({
        message: 'User logged in successfully',
        token: token,
      })
    } else {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }
  },
)
