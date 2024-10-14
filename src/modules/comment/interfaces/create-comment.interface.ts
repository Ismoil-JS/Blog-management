import { Blog, User } from '../../../entities'

export declare interface CreateCommentDto {
  author_id: User
  blog_id: Blog
  content: string
}
