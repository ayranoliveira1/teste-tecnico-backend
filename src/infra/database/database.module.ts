import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrimsaUserRepository } from './prisma/repositories/prisma-user-repository'
import { TaskRepository } from '@/domain/application/repositories/task-repository'
import { PrismaTaskRepository } from './prisma/repositories/prisma-task-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrimsaUserRepository,
    },
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [PrismaService, UserRepository, TaskRepository],
})
export class DataBaseModule {}
