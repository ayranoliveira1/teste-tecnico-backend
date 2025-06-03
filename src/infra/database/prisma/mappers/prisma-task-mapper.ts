import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Task } from '@/domain/enterprise/entities/task'
import { Prisma, Task as PrismaTask } from '@prisma/client'

export class PrismaTaskMapper {
  static toDomain(raw: PrismaTask): Task {
    return Task.create({
      title: raw.title,
      description: raw.description || undefined,
      status: raw.status as 'pending' | 'completed',
      dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
      userId: new UniqueEntityId(raw.userId),
      isDeleted: raw.isDeleted,
    })
  }

  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description || null,
      status: task.status,
      dueDate: task.dueDate,
      userId: task.userId.toString(),
      isDeleted: task.isDeleted ?? false,
    }
  }
}
