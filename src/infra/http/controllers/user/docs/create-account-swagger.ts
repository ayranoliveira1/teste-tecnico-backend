import { ApiProperty } from '@nestjs/swagger'

export class CreateAccountSwagger {
  @ApiProperty({ example: 'João da Silva' })
  name: string

  @ApiProperty({ example: 'user@email.com' })
  email: string

  @ApiProperty({ example: 'minhasenha123' })
  password: string
}
