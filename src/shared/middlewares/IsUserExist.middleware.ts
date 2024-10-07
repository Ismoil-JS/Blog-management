import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../../data-sourse'
import { User } from '../../entities'

export const isUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({ where: { email } })

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User is not found with this email',
    })
  }

  next()
}
