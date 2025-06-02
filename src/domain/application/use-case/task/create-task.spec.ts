import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { CreateTaskUseCase } from './create-task'
import { makeTask } from 'test/factories/make-task'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: CreateTaskUseCase

describe('Create Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new CreateTaskUseCase(inMemoryTaskRepository)
  })

  it('should be able to create a task', async () => {
    const task = makeTask()

    const result = await sut.execute({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      userId: task.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      task: inMemoryTaskRepository.items[0],
    })
  })
})
