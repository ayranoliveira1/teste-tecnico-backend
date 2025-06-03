import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'

interface UpdateTaskUseCaseRequest {
  taskId: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  dueDate?: Date
  userId: string
}

type UpdateTaskUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    taskId,
    title,
    description,
    status,
    dueDate,
    userId,
  }: UpdateTaskUseCaseRequest): Promise<UpdateTaskUseCaseResponse> {
    const task = await this.taskRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (task.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    task.title = title
    task.description = description
    task.status = status
    task.dueDate = dueDate

    await this.taskRepository.update(task)

    return right(null)
  }
}
