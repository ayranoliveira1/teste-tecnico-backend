import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from '@nestjs/common'
import { UpdateTaskUseCase } from '@/domain/application/use-case/task/update-task'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

const updateTaskBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).default('pending'),
  dueDate: z.coerce.date().optional(),
})

type UpdateTaskBodyType = z.infer<typeof updateTaskBodySchema>

const bodyValidationType = new ZodValidationPipe(updateTaskBodySchema)

@Controller('/tasks/:taskId')
export class UpdateTaskController {
  constructor(private updateTaskUseCase: UpdateTaskUseCase) {}

  @Put()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('taskId') taskId: string,
    @Body(bodyValidationType) body: UpdateTaskBodyType,
  ) {
    updateTaskBodySchema.parse(body)

    const userId = user.sub

    const { title, description, status, dueDate } = body

    const result = await this.updateTaskUseCase.execute({
      taskId,
      title,
      description,
      status,
      dueDate,
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
  }
}
