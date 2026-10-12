import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 'ad0ba182-8eef-47e0-ac31-bc5664672e27' })
  id: string;

  @ApiProperty({ example: 'runner@example.com' })
  email: string;

  @ApiProperty({ example: 'Dani' })
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
