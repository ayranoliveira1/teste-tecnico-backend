import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

const tokenShema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenShema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envConfig: EnvService) {
    const publicKey = envConfig.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenShema.parse(payload)
  }
}
