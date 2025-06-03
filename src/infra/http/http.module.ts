import { Module } from '@nestjs/common'
import { DataBaseModule } from '../database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { CreateAccountController } from './controllers/user/create-account.controller'
import { RegisterUseCase } from '@/domain/application/use-case/user/register'
import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { RefreshTokenController } from './controllers/user/refresh-token.controller'
import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'
import { CreateTaskController } from './controllers/task/create-task.controller'
import { CreateTaskUseCase } from '@/domain/application/use-case/task/create-task'
import { GetTasksController } from './controllers/task/get-tasks.controller'
import { GetTasksUseCase } from '@/domain/application/use-case/task/get-tasks'
import { GetTaskByIdController } from './controllers/task/get-taks-by-id.controller'
import { GetTaskByIdUseCase } from '@/domain/application/use-case/task/get-task-by-id'
import { UpdateTaskController } from './controllers/task/update-task.controller'
import { UpdateTaskUseCase } from '@/domain/application/use-case/task/update-task'

@Module({
  imports: [DataBaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    RefreshTokenController,
    CreateTaskController,
    GetTasksController,
    GetTaskByIdController,
    UpdateTaskController,
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    CreateTaskUseCase,
    GetTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
  ],
})
export class HttpModule {}
