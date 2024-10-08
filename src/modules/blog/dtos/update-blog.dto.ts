import { IsOptional, IsString } from 'class-validator'

export class BlogUpdateDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsString({ each: true })
  @IsOptional()
  tags?: string[]
}
