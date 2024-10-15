import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { Blog } from './Blog'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author_id!: User

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog_id!: Blog

  @Column()
  content!: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @CreateDateColumn({ type: 'timestamp' })
  updated_at!: Date
}
