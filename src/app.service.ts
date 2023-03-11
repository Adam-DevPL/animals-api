import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './app.schema';
import { CreateTodoDto } from './creat-app.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Todo.name) private readonly model: Model<TodoDocument>,
  ) {}
  async getHello(): Promise<string> {
    await this.cacheManager.set('greetings', 'Hello World, Fucke Yeahh');
    const hello: string = await this.cacheManager.get('greetings');
    const todos: Todo[] = await this.model.find().exec();

    const createTodoDto: CreateTodoDto = {
      title: 'test',
      description: 'test',
    };

    await new this.model({
      ...createTodoDto,
      createdAt: new Date(),
    }).save();

    console.log(todos);

    if (hello) {
      return hello;
    }

    return 'Redis not working';
  }
}
