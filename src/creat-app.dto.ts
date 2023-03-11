import { BaseTodoDto } from './app.dto';

export class CreateTodoDto extends BaseTodoDto {}

export class UpdateTodoDto extends BaseTodoDto {
  completedAt: Date;
}
