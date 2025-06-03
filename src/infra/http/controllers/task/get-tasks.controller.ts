import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetTasksUseCase } from '@/domain/application/use-case/task/get-tasks'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { TaskPresenter } from '../../presenters/task-presenter'

@Controller('/tasks')
export class GetTasksController {
  constructor(private getTasksUseCase: GetTasksUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getTasksUseCase.execute({ userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const tasks = result.value

    return {
      tasks: await Promise.all(tasks.map((task) => TaskPresenter.toHttp(task))),
    }
  }
}
