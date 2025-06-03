import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

interface GetTaskByIdUseCaseRequest {
  taskId: string
  userId: string
}

type GetTaskByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    task: Task
  }
>

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    taskId,
    userId,
  }: GetTaskByIdUseCaseRequest): Promise<GetTaskByIdUseCaseResponse> {
    const task = await this.taskRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (task.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    return right({ task })
  }
}
