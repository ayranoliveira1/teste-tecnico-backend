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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTaskByIdSwaggerResponse } from './docs/get-task-by-id-swagger'

@Controller('/tasks/:taskId')
@ApiTags('Tasks')
export class GetTaskByIdController {
  constructor(private getTaskByIdUseCase: GetTaskByIdUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get task by ID',
    description:
      'Retrieves a specific task by its ID for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the task.',
    type: GetTaskByIdSwaggerResponse,
  })
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
