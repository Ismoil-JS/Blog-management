import { NextFunction, Response } from 'express'
import { Blog, User } from '../../entities'
import { AppDataSource } from '../../data-sourse'

export const BlogOwnerOrAdminMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { id: author_id } = req.user
  const { id: blog_id } = req.params

  const blogRepository = AppDataSource.getRepository(Blog)
  const blog = await blogRepository.findOne({ where: { id: blog_id } })

  if (!blog) {
    return res.status(404).json({
      status: 404,
      message: 'Blog is not found with this id',
    })
  }

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({ where: { id: author_id } })

  if (author_id !== blog.author_id && user?.role !== 'admin') {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden: You are not the owner of this blog',
    })
  }

  next()
}
