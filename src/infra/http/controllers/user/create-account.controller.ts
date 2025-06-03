import { RegisterUseCase } from '@/domain/application/use-case/user/register'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/domain/application/use-case/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateAccountSwagger } from './docs/create-account-swagger'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateAccountBodyType = z.infer<typeof createAccountBodySchema>

const bodyValidationPepe = new ZodValidationPipe(createAccountBodySchema)

@Controller('/auth/register')
@Public()
@ApiTags('Authentication')
export class CreateAccountController {
  constructor(private registerUser: RegisterUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new user account',
    description: 'Endpoint to register a new user account.',
  })
  @ApiBody({ type: CreateAccountSwagger })
  @ApiResponse({
    status: 201,
    description: 'User account created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists.',
  })
  async handle(@Body(bodyValidationPepe) body: CreateAccountBodyType) {
    createAccountBodySchema.parse(body)

    const { name, email, password } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
