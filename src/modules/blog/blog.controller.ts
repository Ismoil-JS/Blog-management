import { Request, Response, Router } from 'express'
import { BlogService } from './blog.service'
import {
  BlogOwnerOrAdminMiddleware,
  IsUUID,
  validateReqBody,
  validateSearchParams,
} from '../../shared'
import { BlogParamsDto, blogParamsDtoSchema, createBlogSchema } from './schemas'
import { TokenParserMiddleware } from '../../shared'
import { updateBlogSchema } from './schemas'
import { BlogOwnerMiddleware } from '../../shared'

export const blogRouter = Router()
const blogService = new BlogService()

blogRouter.post(
  '/',
  TokenParserMiddleware,
  validateReqBody(createBlogSchema),
  async (req: any, res: Response) => {
    try {
      const { title, content, tags } = req.body
      const { id } = req.user

      await blogService.createBlog({
        author_id: id,
        payload: {
          title,
          content,
          tags,
        },
      })
      return res.status(201).json({
        message: 'Blog created successfully',
      })
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error creating blog',
        error: error.message,
      })
    }
  },
)

blogRouter.get(
  '/',
  validateSearchParams(blogParamsDtoSchema),
  async (req: Request, res: Response) => {
    try {
      const searchParams = req.query as unknown as BlogParamsDto
      const blogs = await blogService.getBlogs(searchParams)
      return res.status(200).json(blogs)
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error retrieving blogs',
        error: error.message,
      })
    }
  },
)

blogRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const blog = await blogService.getBlogById(id)

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      })
    }

    return res.status(200).json(blog)
  } catch (error: any) {
    return res.status(500).json({
      message: 'Error retrieving blog',
      error: error.message,
    })
  }
})

blogRouter.patch(
  '/:id',
  IsUUID,
  TokenParserMiddleware,
  BlogOwnerMiddleware,
  validateReqBody(updateBlogSchema),
  async (req: any, res: Response) => {
    try {
      const { title, content, tags } = req.body
      const { id } = req.params

      const blog = await blogService.updateBlog(id, {
        title,
        content,
        tags,
      })

      if (!blog) {
        return res.status(404).json({
          message: 'Blog not found with the provided id',
        })
      }

      return res.status(200).json({
        message: 'Blog updated successfully',
      })
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error updating blog',
        error: error.message,
      })
    }
  },
)

blogRouter.delete(
  '/:id',
  IsUUID,
  TokenParserMiddleware,
  BlogOwnerOrAdminMiddleware,
  async (req: any, res: Response) => {
    try {
      const { id } = req.params

      const isDeleted = await blogService.deleteBlog(id)

      if (!isDeleted) {
        return res.status(404).json({
          message: 'Blog not found with the provided id',
        })
      }

      return res.status(200).json({
        message: 'Blog deleted successfully',
      })
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error deleting blog',
        error: error.message,
      })
    }
  },
)

blogRouter.patch(
  '/:id/like',
  IsUUID,
  TokenParserMiddleware,
  async (req: any, res: Response) => {
    try {
      const { id } = req.params
      const { id: user_id } = req.user

      await blogService.likeBlog(id, user_id)

      return res.status(200).json({
        message: 'Blog liked/disliked successfully',
      })
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error liking blog',
        error: error.message,
      })
    }
  },
)
