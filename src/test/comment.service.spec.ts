import { CommentService } from '../modules'
import { Comment } from '../entities'
import { AppDataSource } from '../data-sourse'
import { NotFoundError } from '../shared'

jest.mock('../data-sourse')

describe('CommentService', () => {
  let commentService: CommentService
  let mockCommentRepository: any

  beforeEach(() => {
    mockCommentRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    }
    ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockCommentRepository,
    )
    commentService = new CommentService()
  })

  describe('getComments', () => {
    it('should return an array of comments for a given blog_id', async () => {
      const mockComments = [new Comment(), new Comment()]
      mockCommentRepository.find.mockResolvedValue(mockComments)

      const result = await commentService.getComments('blog-id')

      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { blog_id: { id: 'blog-id' } },
      })
      expect(result).toEqual(mockComments)
    })
  })

  describe('updateComment', () => {
    it('should update and return a comment', async () => {
      const mockComment = new Comment()
      mockComment.content = 'old content'
      mockCommentRepository.findOne.mockResolvedValue(mockComment)
      mockCommentRepository.save.mockResolvedValue(mockComment)

      const result = await commentService.updateComment(
        'comment-id',
        'new content',
      )

      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockComment)
      expect(result.content).toEqual('new content')
    })

    it('should throw NotFoundError if comment is not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null)

      await expect(
        commentService.updateComment('invalid-id', 'new content'),
      ).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteComment', () => {
    it('should delete a comment and return true if successful', async () => {
      mockCommentRepository.findOne.mockResolvedValue(new Comment())
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 })

      const result = await commentService.deleteComment('comment-id')

      expect(mockCommentRepository.delete).toHaveBeenCalledWith({
        id: 'comment-id',
      })
      expect(result).toBe(true)
    })

    it('should return false if deletion is not successful', async () => {
      mockCommentRepository.findOne.mockResolvedValue(new Comment())
      mockCommentRepository.delete.mockResolvedValue({ affected: 0 })

      const result = await commentService.deleteComment('comment-id')

      expect(mockCommentRepository.delete).toHaveBeenCalledWith({
        id: 'comment-id',
      })
      expect(result).toBe(false)
    })

    it('should throw NotFoundError if comment is not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null)

      await expect(commentService.deleteComment('invalid-id')).rejects.toThrow(
        NotFoundError,
      )
    })
  })
})
