import { ILike } from 'typeorm'
import { AppDataSource } from '../../data-sourse'
import { Blog, User } from '../../entities'
import { NotFoundError } from '../../shared'
import type { BlogCreateDto, BlogUpdateDto } from './dtos'
import { BlogParamsDto } from './schemas'

interface CreateBlogRequest {
  author_id: string
  payload: BlogCreateDto
}

export class BlogService {
  private blogRepository = AppDataSource.getRepository(Blog)
  private userRepository = AppDataSource.getRepository(User)

  async createBlog({ author_id, payload }: CreateBlogRequest): Promise<Blog> {
    const newBlog = new Blog()

    newBlog.author_id = author_id
    newBlog.title = payload.title
    newBlog.content = payload.content
    newBlog.tags = payload.tags

    return await this.blogRepository.save(newBlog)
  }

  async getBlogs(searchParams: BlogParamsDto): Promise<any> {
    const page = searchParams.page || 1
    const limit = searchParams.limit || 10
    const { title, sortBy = 'created_at', sortOrder = 'DESC' } = searchParams

    const blogs = await this.blogRepository.find({
      where: {
        ...(title && { title: ILike(`%${title}%`) }),
      },
      order: {
        [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['likes'],
    })

    return blogs.map((blog) => ({
      ...blog,
      likes: blog.likes ? blog.likes.map((user) => user.id) : [],
      likesCount: blog.likes ? blog.likes.length : 0,
    }))
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({
      where: { id },
    })

    if (!blog) {
      throw new NotFoundError('Blog not found')
    }

    return blog
  }

  async updateBlog(id: string, payload: BlogUpdateDto): Promise<Blog | null> {
    const blog = await this.getBlogById(id)

    if (!blog) {
      throw new NotFoundError('Blog not found')
    }

    blog.title = payload.title ? payload.title : blog.title
    blog.content = payload.content ? payload.content : blog.content
    blog.tags = payload.tags ? payload.tags : blog.tags

    return await this.blogRepository.save(blog)
  }

  async deleteBlog(id: string): Promise<boolean | undefined> {
    const blog = await this.getBlogById(id)

    if (!blog) {
      throw new NotFoundError('Blog not found with this id')
    }

    const isdeleted = await this.blogRepository.delete({ id })

    if (isdeleted.affected) {
      return true
    } else {
      return false
    }
  }

  async likeBlog(id: string, userId: string): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['likes'],
    })

    if (!blog) {
      throw new NotFoundError('Blog not found with the provided id')
    }

    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundError('User not found with the provided id')
    }

    const userAlreadyLiked =
      blog.likes && blog.likes.some((likedUser) => likedUser.id === user.id)

    if (userAlreadyLiked) {
      blog.likes =
        blog.likes && blog.likes.filter((likedUser) => likedUser.id !== user.id)
    } else {
      blog.likes && blog.likes.push(user)
    }

    await this.blogRepository.save(blog)

    return blog
  }
}
