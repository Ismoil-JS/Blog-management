import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../../data-sourse'
import { User } from '../../entities'

export const checkAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({ where: { email } })

  if (user) {
    return res.status(400).json({
      status: 400,
      message: 'User with this email already exists',
    })
  }

  next()
}
