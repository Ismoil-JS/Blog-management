import { NextFunction, Response } from 'express'
import { Blog } from '../../entities'
import { AppDataSource } from '../../data-sourse'

export const BlogOwnerMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { id: author_id } = req.user
  const { id: blog_id } = req.params

  const userRepository = AppDataSource.getRepository(Blog)
  const blog = await userRepository.findOne({ where: { id: blog_id } })

  if (!blog) {
    return res.status(404).json({
      status: 404,
      message: 'Blog is not found with this id',
    })
  }

  if (author_id !== blog.author_id) {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden: You are not the owner of this blog',
    })
  }

  next()
}
