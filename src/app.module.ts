import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './app.schema';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { Module } from '@nestjs/common';
import { MongooseConfigModule } from './mongoose-config/mongoose-config.module';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';
import { AnimalsModule } from './animals/animals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    RedisCacheModule,
    MongooseConfigModule,
    AnimalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
