import { GetTaskByIdUseCase } from '@/domain/application/use-case/task/get-task-by-id'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
} from '@nestjs/common'
import { TaskPresenter } from '../../presenters/task-presenter'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

@Controller('/tasks/:taskId')
export class GetTaskByIdController {
  constructor(private getTaskByIdUseCase: GetTaskByIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('taskId') taskId: string,
  ) {
    const userId = user.sub

    const result = await this.getTaskByIdUseCase.execute({
      taskId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
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
