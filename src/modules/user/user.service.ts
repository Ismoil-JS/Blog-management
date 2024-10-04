import { AppDataSource } from '../../data-sourse'
import { User } from '../../entities/User'
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
}
