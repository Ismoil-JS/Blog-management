import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { Comment } from './Comment'

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  author_id!: string

  @Column()
  title!: string

  @Column()
  content!: string

  @Column('text', { array: true })
  tags?: string[]

  @OneToMany(() => Comment, (comment) => comment.blog_id)
  comments?: Comment[]

  @ManyToMany(() => User, (user) => user.liked_blogs, { cascade: true })
  @JoinTable()
  likes?: User[]

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @CreateDateColumn({ type: 'timestamp' })
  updated_at!: Date
}
