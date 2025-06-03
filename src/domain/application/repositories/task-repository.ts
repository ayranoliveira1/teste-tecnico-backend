import { Task } from '@/domain/enterprise/entities/task'

export abstract class TaskRepository {
  abstract findById(id: string): Promise<Task | null>
  abstract findMany(userId: string): Promise<Task[] | null>
  abstract create(task: Task): Promise<void>
  abstract update(task: Task): Promise<void>
  abstract delete(task: Task): Promise<void>
}
