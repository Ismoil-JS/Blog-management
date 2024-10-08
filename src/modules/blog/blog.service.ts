import { AppDataSource } from '../../data-sourse'
import { Blog } from '../../entities/Blog'
import { BlogCreateDto } from './dtos'
import { BlogUpdateDto } from './dtos/update-blog.dto'
import { BlogParamsDto } from './schemas'

export class BlogService {
  private blogRepository = AppDataSource.getRepository(Blog)

  async createBlog(payload: BlogCreateDto): Promise<Blog> {
    const newBlog = new Blog()

    newBlog.author_id = payload.author_id
    newBlog.title = payload.title
    newBlog.content = payload.content
    newBlog.tags = payload.tags

    return await this.blogRepository.save(newBlog)
  }

  async getBlogs(searchParams: BlogParamsDto): Promise<Blog[]> {
    const page = searchParams.page || 1
    const limit = searchParams.limit || 2

    return await this.blogRepository.find({
      where: {},
      take: limit,
      skip: (page - 1) * limit,
    })
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({
      where: { id },
    })

    if (!blog) {
      return null
    }

    return blog
  }

  async updateBlog(id: string, payload: BlogUpdateDto): Promise<Blog | null> {
    const blog = await this.getBlogById(id)

    if (!blog) {
      return null
    }

    blog.title = payload.title ? payload.title : blog.title
    blog.content = payload.content ? payload.content : blog.content
    blog.tags = payload.tags ? payload.tags : blog.tags

    return await this.blogRepository.save(blog)
  }

  async deleteBlog(id: string): Promise<boolean | undefined> {
    const blog = await this.getBlogById(id)

    if (!blog) {
      return false
    }

    const isdeleted = await this.blogRepository.delete({ id })

    if (isdeleted.affected) {
      return true
    } else {
      return false
    }
  }
}
