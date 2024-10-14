import { Router } from 'express'
import { CommentService } from './comment.service'
import {
  CommentOwnerMiddleware,
  IsUUID,
  TokenParserMiddleware,
  validateReqBody,
  validateSearchParams,
} from '../../shared'
import { createCommentSchema } from './schemas'
import { CommentOwnerOrAdminMiddleware } from '../../shared/middlewares/CommentOwnerOrAdmin.middleware'
import { BlogParamsDto, blogParamsDtoSchema } from '../blog'

export const commentRouter = Router()
const commentService = new CommentService()

commentRouter.post(
  '/blogs/:blog_id/comments',
  validateReqBody(createCommentSchema),
  TokenParserMiddleware,
  async (req: any, res) => {
    try {
      const { content } = req.body
      const { id: author_id } = req.user
      const { blog_id } = req.params

      if (!blog_id || !author_id || !content || !content.trim()) {
        return res.status(400).json({ message: 'Error with some fields' })
      } else {
        const comment = await commentService.createComment({
          author_id,
          blog_id,
          content: content.trim(),
        })
        res.status(201).json(comment)
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },
)

commentRouter.get(
  '/blogs/:blog_id/comments',
  validateSearchParams(blogParamsDtoSchema),
  async (req, res) => {
    try {
      const searchParams = req.query as unknown as BlogParamsDto
      const { blog_id } = req.params
      const comments = await commentService.getComments({
        blog_id,
        searchParams,
      })

      if (!comments.length) {
        return res
          .status(404)
          .json({ message: 'No comments found on this blog' })
      } else {
        return res.status(200).json(comments)
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },
)

commentRouter.get('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params
    const comment = await commentService.getCommentById(id)
    res.status(200).json(comment)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
})

commentRouter.patch(
  '/comments/:id',
  IsUUID,
  TokenParserMiddleware,
  CommentOwnerMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params
      const { content } = req.body
      const comment = await commentService.updateComment(id, content)
      res.status(200).json(comment)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },
)

commentRouter.delete(
  '/comments/:id',
  IsUUID,
  TokenParserMiddleware,
  CommentOwnerOrAdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params
      const isDeleted = await commentService.deleteComment(id)
      if (isDeleted) {
        res.status(200).json({ message: 'Comment deleted successfully' })
      } else {
        res.status(400).json({ message: 'Error deleting comment' })
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },
)
