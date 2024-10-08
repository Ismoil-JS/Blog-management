import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  author_id!: string

  @Column()
  title!: string

  @Column()
  content!: string

  @Column('text', { array: true })
  tags!: string[]

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @CreateDateColumn({ type: 'timestamp' })
  updated_at!: Date
}
