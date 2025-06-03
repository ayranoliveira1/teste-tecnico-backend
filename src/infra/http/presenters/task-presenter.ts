import { Task } from '@/domain/enterprise/entities/task'

export class TaskPresenter {
  static toHttp(task: Task) {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  }
}
