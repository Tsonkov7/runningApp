import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'The password of the user', example: 'password' })
  @IsNotEmpty()
  password: string;
}
