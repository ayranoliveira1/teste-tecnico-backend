import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { DeleteTaskUseCase } from './delete-task'
import { makeTask } from 'test/factories/make-task'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: DeleteTaskUseCase

describe('Delete Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new DeleteTaskUseCase(inMemoryTaskRepository)
  })

  it('should be able to delete a task', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: task.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTaskRepository.items[0].isDeleted).toBe(true)
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

  it('should return an error if the user is not allowed to delete the task', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
