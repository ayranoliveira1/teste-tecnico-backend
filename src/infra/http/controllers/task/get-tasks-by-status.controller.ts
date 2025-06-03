import { GetTasksByStatusUseCase } from '@/domain/application/use-case/task/get-tasks-by-status'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { TaskPresenter } from '../../presenters/task-presenter'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTasksByStatusSwaggerResponse } from './docs/get-tasks-by-status'

@Controller('/tasks-status')
@ApiTags('Tasks')
export class GetTasksByStatusController {
  constructor(private getTasksByStatusUseCase: GetTasksByStatusUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get tasks by status',
    description:
      'Retrieves tasks filtered by their status (pending or completed) for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tasks by status.',
    type: GetTasksByStatusSwaggerResponse,
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('status') status: 'pending' | 'completed',
  ) {
    const userId = user.sub

    const result = await this.getTasksByStatusUseCase.execute({
      status,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case Error:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const tasks = result.value

    return {
      tasks: await Promise.all(tasks.map((task) => TaskPresenter.toHttp(task))),
    }
  }
}
