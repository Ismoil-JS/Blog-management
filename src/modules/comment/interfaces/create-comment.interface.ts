import { Blog, User } from '../../../entities'

export declare interface CreateCommentInterface {
  author_id: User
  blog_id: Blog
  content: string
}
