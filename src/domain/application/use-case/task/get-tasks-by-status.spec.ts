import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { GetTasksByStatusUseCase } from './get-tasks-by-status'
import { makeTask } from 'test/factories/make-task'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: GetTasksByStatusUseCase

describe('Get Tasks By Status Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new GetTasksByStatusUseCase(inMemoryTaskRepository)
  })

  it('should be able to get tasks by status pending', async () => {
    const task1 = makeTask({
      title: 'Task 1',
      status: 'pending',
    })
    const task2 = makeTask({
      status: 'completed',
    })

    await inMemoryTaskRepository.create(task1)
    await inMemoryTaskRepository.create(task2)

    const result = await sut.execute({
      status: 'pending',
      userId: task1.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(1)
    expect(result.value[0].id).toBe(task1.id)
  })

  it('should be able to get tasks by status completed', async () => {
    const task1 = makeTask({
      title: 'Task 1',
      status: 'completed',
    })
    const task2 = makeTask({
      status: 'pending',
    })

    await inMemoryTaskRepository.create(task1)
    await inMemoryTaskRepository.create(task2)

    const result = await sut.execute({
      status: 'completed',
      userId: task1.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(1)
    expect(result.value[0].id).toBe(task1.id)
  })

  it('should return an error if no tasks found for the given status', async () => {
    const result = await sut.execute({
      status: 'completed',
      userId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
