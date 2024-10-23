import { AppDataSource } from '../data-sourse'
import { BlogService } from '../modules'
import { Blog } from '../entities'
import { BlogCreateDto, BlogUpdateDto } from '../modules'
import { BlogParamsDto } from '../modules'
import { ILike } from 'typeorm'

jest.mock('../data-sourse')

describe('BlogService', () => {
  let blogService: BlogService
  let blogRepository: any

  beforeEach(() => {
    blogRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    }
    ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(blogRepository)
    blogService = new BlogService()
  })

  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const author_id = '1'
      const payload: BlogCreateDto = {
        title: 'Test Blog',
        content: 'Test Content',
        tags: ['tag1', 'tag2'],
      }
      const savedBlog = { id: '1', author_id, ...payload }

      blogRepository.save.mockResolvedValue(savedBlog)

      const result = await blogService.createBlog({ author_id, payload })

      expect(blogRepository.save).toHaveBeenCalledWith(expect.any(Blog))
      expect(result).toEqual(savedBlog)
    })
  })

  describe('getBlogs', () => {
    it('should return a list of blogs with pagination', async () => {
      const searchParams: BlogParamsDto = {
        page: 1,
        limit: 2,
        sortBy: 'created_at', // Default sortBy
        sortOrder: 'DESC',
        title: 'Test',
      }
      const blogs = [{ id: '1', title: 'Test Blog', likes: [], likesCount: 0 }]

      blogRepository.find = jest.fn().mockResolvedValue(blogs)

      const result = await blogService.getBlogs(searchParams)

      expect(blogRepository.find).toHaveBeenCalledWith({
        where: {
          title: ILike(`%${searchParams.title}%`),
        },
        order: {
          [searchParams.sortBy]: searchParams.sortOrder.toUpperCase() as
            | 'ASC'
            | 'DESC',
        },
        take: 2,
        skip: 0,
        relations: ['likes'],
      })

      expect(result).toEqual(blogs)
    })
  })

  describe('getBlogById', () => {
    it('should return a blog by ID', async () => {
      const blog = { id: '1', title: 'Test Blog' }

      blogRepository.findOne.mockResolvedValue(blog)

      const result = await blogService.getBlogById('1')

      expect(blogRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
      expect(result).toEqual(blog)
    })

    it('should throw NotFoundError if blog is not found', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      await expect(blogService.getBlogById('999')).rejects.toThrow(
        'Blog not found',
      )
    })
  })

  describe('updateBlog', () => {
    it('should update a blog if found', async () => {
      const blog = {
        id: '1',
        title: 'Old Title',
        content: 'Old Content',
        tags: ['old'],
      }
      const payload: BlogUpdateDto = { title: 'New Title' }

      blogRepository.findOne.mockResolvedValue(blog)
      blogRepository.save.mockResolvedValue({ ...blog, ...payload })

      const result = await blogService.updateBlog('1', payload)

      expect(blogRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
      expect(blogRepository.save).toHaveBeenCalledWith({
        ...blog,
        title: 'New Title',
        content: 'Old Content',
        tags: ['old'],
      })
      expect(result).toEqual({ ...blog, ...payload })
    })

    it('should throw NotFoundError if blog is not found for updating', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      await expect(
        blogService.updateBlog('999', { title: 'New Title' }),
      ).rejects.toThrow('Blog not found')
    })
  })

  describe('deleteBlog', () => {
    it('should delete a blog if found', async () => {
      const blog = { id: '1', title: 'Test Blog' }

      blogRepository.findOne.mockResolvedValue(blog)
      blogRepository.delete.mockResolvedValue({ affected: 1 })

      const result = await blogService.deleteBlog('1')

      expect(blogRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
      expect(blogRepository.delete).toHaveBeenCalledWith({ id: '1' })
      expect(result).toBe(true)
    })

    it('should throw NotFoundError if blog is not found for deletion', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      await expect(blogService.deleteBlog('999')).rejects.toThrow(
        'Blog not found',
      )

      expect(blogRepository.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
      })
    })
  })
})
