import { ApiProperty } from '@nestjs/swagger'

export class GetTaskByIdSwaggerResponse {
  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'New Task',
      description: 'Task description',
      dueDate: '2023-12-31T23:59:59.999Z',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  task: {
    id: string
    title: string
    description?: string
    dueDate?: string
    status?: 'pending' | 'completed'
    createdAt: Date
    updatedAt: Date
  }
}
