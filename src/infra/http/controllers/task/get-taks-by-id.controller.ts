import { GetTaskByIdUseCase } from '@/domain/application/use-case/task/get-task-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { TaskPresenter } from '../../presenters/task-presenter'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

@Controller('/tasks/:taskId')
export class GetTaskByIdController {
  constructor(private getTaskByIdUseCase: GetTaskByIdUseCase) {}

  @Get()
  async handle(@Param('taskId') taskId: string) {
    const result = await this.getTaskByIdUseCase.execute({
      taskId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const response = result.value

    return {
      task: TaskPresenter.toHttp(response.task),
    }
  }
}
