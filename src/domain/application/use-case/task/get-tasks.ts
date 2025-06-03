import { Either, left, right } from '@/core/either'
import { Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

interface GetTasksUseCaseRequest {
  userId: string
}

type GetTasksUseCaseResponse = Either<ResourceNotFoundError, Task[]>

@Injectable()
export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    userId,
  }: GetTasksUseCaseRequest): Promise<GetTasksUseCaseResponse> {
    const result = await this.taskRepository.findMany(userId)

    if (!result) {
      return left(new ResourceNotFoundError())
    }

    return right(result)
  }
}
