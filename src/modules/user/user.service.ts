import { AppDataSource } from '../../data-sourse'
import { User, UserRole } from '../../entities/User'
import { NotFoundError } from '../../shared'
import { UserCreateDto, UserLoginDto } from './dtos'

export class UserService {
  private userRepository = AppDataSource.getRepository(User)

  // Create a new user
  async createUser(payload: UserCreateDto): Promise<User> {
    const newUser = new User()

    const hashedPassword = await newUser.hashPassword(payload.password)
    newUser.username = payload.username
    newUser.email = payload.email
    newUser.password = hashedPassword
    return await this.userRepository.save(newUser)
  }

  // Login user
  async loginUser(payload: UserLoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    })

    const isPasswordValid = await user?.validatePassword(payload.password)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async promoteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundError('User not found with the provided id')
    }

    user.role = UserRole.ADMIN
    return await this.userRepository.save(user)
  }

  async demoteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundError('User not found with the provided id')
    }

    user.role = UserRole.USER
    return await this.userRepository.save(user)
  }
}
