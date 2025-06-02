import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Task, TaskProps } from '@/domain/enterprise/entities/task'

import { faker } from '@faker-js/faker'

export function makeTask(
  overrides: Partial<TaskProps> = {},
  id?: UniqueEntityId,
) {
  const task = Task.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      dueDate: faker.date.future(),
      status: 'pending',
      userId: new UniqueEntityId(),
      ...overrides,
    },
    id,
  )

  return task
}
