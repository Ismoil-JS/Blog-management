import { Router } from 'express'
import { UserService } from './user.service'
import {
  AdminCheck,
  IsUUID,
  TokenParserMiddleware,
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

userRouter.put(
  '/:id/promote',
  TokenParserMiddleware,
  IsUUID,
  AdminCheck,
  async (req, res) => {
    try {
      const { id } = req.params
      const user = await userService.promoteUser(id)
      return res.status(200).json({
        message: 'User promoted successfully',
        user: `User ${user.username} is now an admin`,
        role: user.role,
      })
    } catch (error: any) {
      return res.status(400).json({
        message: 'Error occured while promoting user',
        error: error.message,
      })
    }
  },
)

userRouter.put(
  '/:id/demote',
  TokenParserMiddleware,
  IsUUID,
  AdminCheck,
  async (req, res) => {
    try {
      const { id } = req.params
      const user = await userService.demoteUser(id)
      return res.status(200).json({
        message: 'User demoted successfully',
        user: `User ${user.username} is now a regular user`,
        role: user.role,
      })
    } catch (error: any) {
      return res.status(400).json({
        message: 'Error occured while demoting user',
        error: error.message,
      })
    }
  },
)
