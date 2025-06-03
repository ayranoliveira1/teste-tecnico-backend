import { TaskRepository } from '@/domain/application/repositories/task-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Task } from '@/domain/enterprise/entities/task'
import { PrismaTaskMapper } from '../mappers/prisma-task-mapper'

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    })

    if (!task) return null

    return PrismaTaskMapper.toDomain(task)
  }

  async findMany(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    })

    if (!tasks) return null

    return tasks.map(PrismaTaskMapper.toDomain)
  }

  async findManyByStatus(userId: string, status: 'pending' | 'completed') {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
        status,
      },
    })

    if (!tasks) return null

    return tasks.map(PrismaTaskMapper.toDomain)
  }

  async create(task: Task) {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.create({
      data,
    })
  }

  async update(task: Task) {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(task: Task) {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data: {
        isDeleted: true,
      },
    })
  }
}
