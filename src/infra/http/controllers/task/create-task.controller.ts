import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateTaskUseCase } from '@/domain/application/use-case/task/create-task'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const createTaskBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).default('pending'),
  dueDate: z.coerce.date().optional(),
})

type CreateTaskBodyType = z.infer<typeof createTaskBodySchema>

const bodyValidationType = new ZodValidationPipe(createTaskBodySchema)

@Controller('/tasks')
export class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationType) body: CreateTaskBodyType,
  ) {
    createTaskBodySchema.parse(body)

    const userId = user.sub

    const { title, description, status, dueDate } = body

    const result = await this.createTaskUseCase.execute({
      title,
      description,
      status,
      dueDate,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      id: result.value.task.id.toString(),
    }
  }
}
