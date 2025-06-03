import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateUserSwaggerDto {
  @ApiProperty({ example: 'user@email.com' })
  email: string

  @ApiProperty({ example: 'minhasenha123' })
  password: string
}

export class AuthenticateUserSwaggerResponse {
  @ApiProperty({ example: 'user@email.com' })
  token: string

  @ApiProperty({
    example: {
      id: '123',
      name: 'John Doe',
      email: 'user@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  user: {
    id: string
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
  }
}
