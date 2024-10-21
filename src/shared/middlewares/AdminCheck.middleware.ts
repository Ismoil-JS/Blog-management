import { NextFunction, Request, Response } from 'express'
import { AppDataSource } from '../../data-sourse'
import { User } from '../../entities'

export const AdminCheck = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.user

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({ where: { id: id } })

  if (user?.role !== 'admin') {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden: You are not the admin to do this action',
    })
  }

  next()
}
