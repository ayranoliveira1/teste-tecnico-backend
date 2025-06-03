import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { GetTaskByIdUseCase } from './get-task-by-id'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { makeTask } from 'test/factories/make-task'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: GetTaskByIdUseCase

describe('Get Task By Id Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new GetTaskByIdUseCase(inMemoryTaskRepository)
  })

  it('should be able to get a task by id', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: task.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      task: inMemoryTaskRepository.items[0],
    })
  })

  it('should return an error if the task does not exist', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: 'non-existing-task-id',
      userId: task.userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the user does not own the task', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: 'another-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
