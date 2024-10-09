import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class BlogCreateDto {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  @IsNotEmpty()
  content!: string

  @IsString({ each: true })
  tags?: string[]
}
