import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { makeTask } from 'test/factories/make-task'
import { GetTasksUseCase } from './get-tasks'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: GetTasksUseCase

describe('Get Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new GetTasksUseCase(inMemoryTaskRepository)
  })

  it('should be able to get tasks by userId', async () => {
    const task = makeTask()

    for (let i = 0; i < 10; i++) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({
      userId: task.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(10)
  })

  it('should return an error if the userId is invalid', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
