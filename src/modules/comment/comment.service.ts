import { AppDataSource } from '../../data-sourse'
import { Comment } from '../../entities'
import { NotFoundError } from '../../shared'
import { BlogParamsDto } from '../blog'
import { CreateCommentDto } from './interfaces'

export class CommentService {
  private commentRepository = AppDataSource.getRepository(Comment)

  async createComment(comment: CreateCommentDto): Promise<Comment> {
    const newComment = new Comment()

    newComment.author_id = comment.author_id
    newComment.blog_id = comment.blog_id
    newComment.content = comment.content

    return await this.commentRepository.save(newComment)
  }

  async getComments({
    blog_id,
    searchParams,
  }: {
    blog_id: string
    searchParams: BlogParamsDto
  }): Promise<Comment[]> {
    const page = searchParams.page || 1
    const limit = searchParams.limit || 10
    const comment = await this.commentRepository.find({
      where: {
        blog_id: { id: blog_id },
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return comment
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    })

    if (!comment) {
      throw new NotFoundError('Comment not found with this id')
    }

    return comment
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const comment = await this.getCommentById(id)

    comment.content = content

    return await this.commentRepository.save(comment)
  }

  async deleteComment(id: string): Promise<boolean | undefined> {
    await this.getCommentById(id)
    const isdeleted = await this.commentRepository.delete({ id })
    if (isdeleted.affected) {
      return true
    } else {
      return false
    }
  }
}
