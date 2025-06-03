import { ApiProperty } from '@nestjs/swagger'

export class CreateTaskSwaggerDto {
  @ApiProperty({ example: 'New Task' })
  title: string

  @ApiProperty({ example: 'Task description' })
  description?: string

  @ApiProperty({ example: '2023-12-31T23:59:59.999Z' })
  dueDate?: string

  @ApiProperty({ example: 'pending' })
  status?: 'pending' | 'completed'
}

export class CreateTaskSwaggerResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string
}
