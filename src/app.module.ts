import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { Todo, TodoSchema } from './app.schema';
import { AppService } from './app.service';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { Module } from '@nestjs/common';
import { MongooseConfigModule } from './mongoose-config/mongoose-config.module';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const user = configService.get<string>('MONGO_USERNAME');
    //     const pass = configService.get<string>('MONGO_PASSWORD');
    //     const host = configService.get<string>('MONGO_HOST');
    //     const port = configService.get<string>('MONGO_PORT');

    //     return {
    //       uri: `mongodb://${user}:${pass}@${host}:${port}/?authSource=admin`,
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    // CacheModule.register({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     host: configService.get('REDIS_HOST'),
    //     port: configService.get('REDIS_PORT'),
    //   }),
    // }),
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    RedisCacheModule,
    MongooseConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
