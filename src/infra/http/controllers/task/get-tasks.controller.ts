import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetTasksUseCase } from '@/domain/application/use-case/task/get-tasks'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { TaskPresenter } from '../../presenters/task-presenter'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTasksSwaggerResponse } from './docs/get-tasks-swagger'

@Controller('/tasks')
@ApiTags('Tasks')
export class GetTasksController {
  constructor(private getTasksUseCase: GetTasksUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves all tasks associated with the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tasks.',
    type: GetTasksSwaggerResponse,
  })
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
