import { Either, right } from '@/core/either'
import { Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CreateTaskUseCaseRequest {
  title: string
  description?: string
  status: 'pending' | 'completed'
  dueDate?: Date
  userId: string
}

type CreateTaskUseCaseResponse = Either<
  null,
  {
    task: Task
  }
>

@Injectable()
export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    title,
    description,
    status,
    dueDate,
    userId,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = Task.create({
      title,
      description,
      dueDate,
      userId: new UniqueEntityId(userId),
      status: status,
    })

    await this.taskRepository.create(task)

    return right({
      task,
    })
  }
}
