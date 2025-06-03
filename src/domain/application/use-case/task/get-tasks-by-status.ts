import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Task } from '@/domain/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { TaskRepository } from '../../repositories/task-repository'

interface GetTasksByStatusInput {
  status: 'pending' | 'completed'
  userId: string
}

type GetTasksByStatusOutput = Either<ResourceNotFoundError, Task[]>

@Injectable()
export class GetTasksByStatusUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    status,
    userId,
  }: GetTasksByStatusInput): Promise<GetTasksByStatusOutput> {
    const tasks = await this.taskRepository.findManyByStatus(userId, status)

    if (!tasks) {
      return left(new ResourceNotFoundError())
    }

    return right(tasks)
  }
}
