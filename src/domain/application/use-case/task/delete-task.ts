import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'

interface DeleteTaskUseCaseRequest {
  taskId: string
  userId: string
}

type DeleteTaskUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    taskId,
    userId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.taskRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (task.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    task.isDeleted = true

    await this.taskRepository.update(task)

    return right(null)
  }
}
