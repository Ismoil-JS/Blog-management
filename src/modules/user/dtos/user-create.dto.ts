import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
