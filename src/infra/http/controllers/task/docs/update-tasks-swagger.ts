import { ApiProperty } from '@nestjs/swagger'

export class UpdateTaskSwaggerDto {
  @ApiProperty({ example: 'New Task' })
  title: string

  @ApiProperty({ example: 'Task description' })
  description?: string

  @ApiProperty({ example: '2023-12-31T23:59:59.999Z' })
  dueDate?: string

  @ApiProperty({ example: 'pending' })
  status?: 'pending' | 'completed'
}
