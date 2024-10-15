import { NextFunction, Response } from 'express'
import { Comment } from '../../entities'
import { AppDataSource } from '../../data-sourse'

export const CommentOwnerMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { id: author_id } = req.user
  const { id: comment_id } = req.params

  const commentRepository = AppDataSource.getRepository(Comment)
  const comment = await commentRepository.findOne({
    where: { id: comment_id },
    relations: ['author_id'],
  })

  if (!comment) {
    return res.status(404).json({
      status: 404,
      message: 'Comment is not found with this id',
    })
  }

  const user_id = comment.author_id.id

  if (author_id !== user_id) {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden: You are not the owner of this blog',
    })
  }

  next()
}
