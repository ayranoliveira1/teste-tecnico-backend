import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { Response } from 'express'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/core/@types/errors/invalid-credentials-error'
import { UserPresenter } from '../../presenters/user-presenter'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  AuthenticateUserSwaggerDto,
  AuthenticateUserSwaggerResponse,
} from './docs/authenticate-user-swagger'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

const bodyValidationType = new ZodValidationPipe(authenticateBodySchema)

@Controller('/auth/login')
@Public()
@ApiTags('Authentication')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Endpoint to authenticate a user and return a JWT token.',
  })
  @ApiBody({ type: AuthenticateUserSwaggerDto })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully.',
    type: AuthenticateUserSwaggerResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async handle(
    @Body(bodyValidationType) body: AuthenticateBodyType,
    @Res({ passthrough: true }) res: Response,
  ) {
    authenticateBodySchema.parse(body)

    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token, refreshToken, user } = result.value

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    return {
      token: token,
      user: UserPresenter.toHttp(user),
    }
  }
}
