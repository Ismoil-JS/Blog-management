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
    const { title, content, tags } = req.body
    const { id } = req.user

    await blogService.createBlog({
      author_id: id,
      title,
      content,
      tags,
    })
    return res.status(201).json({
      message: 'Blog created successfully',
    })
  },
)

blogRouter.get(
  '/',
  validateSearchParams(blogParamsDtoSchema),
  async (req: Request, res: Response) => {
    const searchParams = req.query as unknown as BlogParamsDto

    const blogs = await blogService.getBlogs(searchParams)
    return res.status(200).json(blogs)
  },
)

blogRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const blog = await blogService.getBlogById(id)
  if (!blog) {
    return res.status(404).json({
      message: 'Blog not found',
    })
  }

  return res.status(200).json(blog)
})

blogRouter.patch(
  '/:id',
  IsUUID,
  TokenParserMiddleware,
  BlogOwnerMiddleware,
  validateReqBody(updateBlogSchema),
  async (req: any, res: Response) => {
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
  },
)

blogRouter.delete(
  '/:id',
  IsUUID,
  TokenParserMiddleware,
  BlogOwnerOrAdminMiddleware,
  async (req: any, res: Response) => {
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
  },
)
