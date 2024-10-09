import { BlogService } from '../modules'
import { AppDataSource } from '../data-sourse'
import { Blog } from '../entities'
import { BlogCreateDto } from '../modules'
import { BlogUpdateDto } from '../modules'
import { BlogParamsDto } from '../modules'

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
      const payload: BlogCreateDto = {
        author_id: '1',
        title: 'Test Blog',
        content: 'Test Content',
        tags: ['tag1', 'tag2'],
      }
      const savedBlog = { id: '1', ...payload }

      blogRepository.save.mockResolvedValue(savedBlog)

      const result = await blogService.createBlog(payload)

      expect(blogRepository.save).toHaveBeenCalledWith(expect.any(Blog))
      expect(result).toEqual(savedBlog)
    })
  })

  describe('getBlogs', () => {
    it('should return a list of blogs with pagination', async () => {
      const searchParams: BlogParamsDto = { page: 1, limit: 2 }
      const blogs = [{ id: '1', title: 'Test Blog' }]

      blogRepository.find.mockResolvedValue(blogs)

      const result = await blogService.getBlogs(searchParams)

      expect(blogRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 2,
        skip: 0,
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

    it('should return null if blog is not found', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      const result = await blogService.getBlogById('999')

      expect(result).toBeNull()
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

    it('should return null if blog is not found for updating', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      const result = await blogService.updateBlog('999', { title: 'New Title' })

      expect(result).toBeNull()
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

    it('should return false if blog is not found for deletion', async () => {
      blogRepository.findOne.mockResolvedValue(null)

      const result = await blogService.deleteBlog('999')

      expect(result).toBe(false)
    })
  })
})
