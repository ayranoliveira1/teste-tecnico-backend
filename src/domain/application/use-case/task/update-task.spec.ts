import { InMemoryTaskRepository } from 'test/repositories/in-memory-task-repository'
import { UpdateTaskUseCase } from './update-task'
import { makeTask } from 'test/factories/make-task'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

let inMemoryTaskRepository: InMemoryTaskRepository
let sut: UpdateTaskUseCase

describe('Update Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository()
    sut = new UpdateTaskUseCase(inMemoryTaskRepository)
  })

  it('should be able to update a task', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
      dueDate: task.dueDate,
      userId: task.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTaskRepository.items[0].title).toBe('Updated Title')
    expect(inMemoryTaskRepository.items[0].status).toBe('completed')
  })

  it('should return an error if the task does not exist', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: 'non-existing-task-id',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
      dueDate: task.dueDate,
      userId: task.userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the user is not allowed to update the task', async () => {
    const task = makeTask()

    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
      dueDate: task.dueDate,
      userId: 'another-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
