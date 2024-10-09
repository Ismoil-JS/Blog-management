import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @CreateDateColumn({ type: 'timestamp' })
  updated_at!: Date
}
