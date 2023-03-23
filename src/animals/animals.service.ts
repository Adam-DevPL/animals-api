import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnimalDto } from './dto/animal.dto';
import { Animal, AnimalDocument } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async findAll() {
    return this.animalModel.find();
  }

  async findOne(id: string) {
    const animal = await this.animalModel.findById({
      _id: new Types.ObjectId(id),
    });

    if (!animal) {
      throw new NotFoundException();
    }
    return animal;
  }
}
