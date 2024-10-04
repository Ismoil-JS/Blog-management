import { UserService } from '../modules/user/user.service'
import { UserCreateDto, UserLoginDto } from '../modules/user/dtos'
import { User } from '../entities'

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
  })

  describe('createUser', () => {
    it('create a new user with hashed password', async () => {
      const payload: UserCreateDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      const mockUser = new User()
      jest.spyOn(mockUser, 'hashPassword').mockResolvedValue('hashedPassword')

      const savedUser = {
        ...mockUser,
        ...payload,
        password: 'hashedPassword',
      }

      userService['userRepository'].save = jest
        .fn()
        .mockResolvedValue(savedUser)

      const result = await userService.createUser(payload)

      expect(userService['userRepository'].save).toHaveBeenCalledWith(
        expect.any(User),
      )
      expect(result.password).toBe('hashedPassword')
    })
  })

  describe('loginUser', () => {
    it('return user if email and password are valid', async () => {
      const payload: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockUser = {
        email: payload.email,
        validatePassword: jest.fn().mockResolvedValue(true),
      }

      userService['userRepository'].findOne = jest
        .fn()
        .mockResolvedValue(mockUser)

      const result = await userService.loginUser(payload)

      expect(result).toBe(mockUser)
    })

    it('return null if password is invalid', async () => {
      const payload: UserLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const mockUser = {
        email: payload.email,
        validatePassword: jest.fn().mockResolvedValue(false),
      }

      userService['userRepository'].findOne = jest
        .fn()
        .mockResolvedValue(mockUser)

      const result = await userService.loginUser(payload)

      expect(result).toBeNull()
    })
  })
})
