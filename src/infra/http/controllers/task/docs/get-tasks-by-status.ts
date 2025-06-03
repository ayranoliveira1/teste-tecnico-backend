import { ApiProperty } from '@nestjs/swagger'

export class GetTasksByStatusSwaggerResponse {
  @ApiProperty({
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'New Task',
        description: 'Task description',
        dueDate: '2023-12-31T23:59:59.999Z',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Another Task',
        description: 'Another task description',
        dueDate: '2024-01-15T12:00:00.000Z',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  tasks: [
    {
      id: string
      title: string
      description?: string
      dueDate?: string
      status?: 'pending' | 'completed'
      createdAt: Date
      updatedAt: Date
    },

    {
      id: string
      title: string
      description?: string
      dueDate?: string
      status?: 'pending' | 'completed'
      createdAt: Date
      updatedAt: Date
    },
  ]
}
