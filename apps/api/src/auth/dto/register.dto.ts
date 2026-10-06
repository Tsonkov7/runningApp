import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'The password of the user', example: 'password' })
  @IsNotEmpty()
  password: string;
}
