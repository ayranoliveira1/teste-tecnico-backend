import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { InvalidCredentialsError } from '@/core/@types/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { RefreshTokenSwagger } from './docs/refresh-token-swagger'

@Controller('/auth/refresh-token')
@Public()
@ApiTags('Authentication')
export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Refresh user token',
    description:
      'Endpoint to refresh user authentication token using a refresh token.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully.',
    type: RefreshTokenSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid refresh token.',
  })
  async handle(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshToken = req.headers.cookie?.split(';')[0].split('=')[1]

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found')
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken: refreshToken,
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

    res.cookie('refresh_token', result.value.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    return {
      token: result.value.token,
    }
  }
}
