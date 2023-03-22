import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal, AnimalDocument } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async findAll() {
    return this.animalModel.find();
  }
}
