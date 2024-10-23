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

  describe('getProfile', () => {
    it('should return user when user is found', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      }

      userService['userRepository'].findOne = jest
        .fn()
        .mockResolvedValue(mockUser)

      const result = await userService.getProfile('1')

      expect(result).toBe(mockUser)
      expect(userService['userRepository'].findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should throw NotFoundError when user is not found', async () => {
      userService['userRepository'].findOne = jest.fn().mockResolvedValue(null)

      await expect(userService.getProfile('1')).rejects.toThrowError(
        'User not found with the provided id',
      )
      expect(userService['userRepository'].findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })

  describe('updateProfile', () => {
    it('should update the user profile successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'olduser',
        email: 'old@example.com',
      }
      const payload: UserCreateDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      }

      userService['userRepository'].findOne = jest
        .fn()
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null)

      userService['userRepository'].save = jest.fn().mockResolvedValue({
        ...mockUser,
        username: payload.username,
        email: payload.email,
      })

      const result = await userService.updateProfile('1', payload)

      expect(result.username).toBe('newuser')
      expect(result.email).toBe('new@example.com')
      expect(userService['userRepository'].save).toHaveBeenCalledWith({
        ...mockUser,
        username: payload.username,
        email: payload.email,
      })
    })

    it('should throw NotFoundError when user is not found', async () => {
      userService['userRepository'].findOne = jest.fn().mockResolvedValue(null)

      const payload: UserCreateDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      }

      await expect(
        userService.updateProfile('1', payload),
      ).rejects.toThrowError('User not found with the provided id')
      expect(userService['userRepository'].findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should throw an error if a user with the same email already exists', async () => {
      const mockUser = {
        id: '1',
        username: 'olduser',
        email: 'old@example.com',
      }
      const payload: UserCreateDto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      }
      const existingUserWithSameEmail = {
        id: '2',
        email: 'existing@example.com',
      }

      userService['userRepository'].findOne = jest
        .fn()
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingUserWithSameEmail)

      await expect(
        userService.updateProfile('1', payload),
      ).rejects.toThrowError('User with this email already exists')
      expect(userService['userRepository'].findOne).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      })
    })
  })
})
