import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { DeleteTaskUseCase } from '@/domain/application/use-case/task/delete-task'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('/tasks/delete/:taskId')
@ApiTags('Tasks')
export class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Endpoint to delete an existing task for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('taskId') taskId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteTaskUseCase.execute({
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
          throw new BadRequestException(error.message)
      }
    }
  }
}
