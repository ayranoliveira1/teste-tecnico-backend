import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'

interface GetTaskByIdUseCaseRequest {
  taskId: string
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
  }: GetTaskByIdUseCaseRequest): Promise<GetTaskByIdUseCaseResponse> {
    const task = await this.taskRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    return right({ task })
  }
}
