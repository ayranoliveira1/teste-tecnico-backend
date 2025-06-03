import { Optional } from '@/core/@types/options'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface TaskProps {
  title: string
  description?: string
  status: 'pending' | 'completed'
  dueDate?: Date
  userId: UniqueEntityId
  isDeleted?: boolean
  createdAt: Date
  updatedAt?: Date
}

export class Task extends Entity<TaskProps> {
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status
  }

  get dueDate() {
    return this.props.dueDate
  }

  get userId() {
    return this.props.userId
  }

  get isDeleted() {
    return this.props.isDeleted
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set description(description: string | undefined) {
    this.props.description = description
    this.touch()
  }

  set status(status: 'pending' | 'completed') {
    this.props.status = status
    this.touch()
  }

  set dueDate(dueDate: Date | undefined) {
    this.props.dueDate = dueDate
    this.touch()
  }

  set isDeleted(isDeleted: boolean | undefined) {
    this.props.isDeleted = isDeleted
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<TaskProps, 'createdAt' | 'isDeleted'>,
    id?: UniqueEntityId,
  ) {
    const task = new Task(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isDeleted: props.isDeleted ?? false,
      },
      id,
    )

    return task
  }
}
