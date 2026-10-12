// in AuthResponse.dto.ts (or me-response.dto.ts)

import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ example: 'ad0ba182-8eef-47e0-ac31-bc5664672e27' })
  id: string;

  @ApiProperty({ example: 'runner@example.com' })
  email: string;

  @ApiProperty({ example: 'Dani' })
  name: string;

  @ApiProperty({ example: '2026-10-12T10:00:00.000Z' })
  createdAt: Date;
}
