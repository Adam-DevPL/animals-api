import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal, AnimalSchema } from './schemas/animal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
    RedisCacheModule,
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
