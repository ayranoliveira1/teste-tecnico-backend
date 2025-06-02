import { TaskRepository } from '@/domain/application/repositories/task-repository'
import { Task } from '@/domain/enterprise/entities/task'

export class InMemoryTaskRepository implements TaskRepository {
  public items: Task[] = []

  async findById(id: string) {
    const task = this.items.find((item) => item.id.toString() === id)

    if (!task) {
      return null
    }

    return task
  }

  async create(task: Task) {
    this.items.push(task)
  }

  async update(task: Task) {
    const index = this.items.findIndex((item) => item.id === task.id)

    this.items[index] = task
  }

  async delete(task: Task) {
    const index = this.items.findIndex((item) => item.id === task.id)

    this.items.splice(index, 1)
  }
}
