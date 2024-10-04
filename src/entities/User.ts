import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import bcrypt from 'bcrypt'

// Define the role enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  username!: string

  @Column()
  password!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  }) // default role to USER
  role!: UserRole

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  // Add the hashPassword method
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }

  // Add the validatePassword method
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}
