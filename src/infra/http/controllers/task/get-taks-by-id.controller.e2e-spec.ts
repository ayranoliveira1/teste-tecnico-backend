import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get Tasks By Id (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test('[Get] /tasks/:taskId', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    const user = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    const result = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        dueDate: new Date(),
      })
      .set('Authorization', `Bearer ${user.body.token}`)

    const response = await request(app.getHttpServer())
      .get(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.task).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Test Task',
        description: 'This is a test task',
      }),
    )
  })
})
