import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  // async findOne(id: string) {
  //   const animal = await this.animalModel.findById({ _id: { $eq: id } });
  //   if (!animal) {
  //     throw new NotFoundException();
  //   }
  //   return animal;
  // }

  // create(postData: AnimalDto) {
  //   const createdAnimal = new this.animalModel({
  //     ...postData,
  //     createdAt: new Date(),
  //   });
  //   return createdAnimal.save();
  // }

  // async update(id: string, animalData: AnimalDto) {
  //   const animal = await this.animalModel
  //     .findByIdAndUpdate({ _id: { $eq: id } }, animalData)
  //     .setOptions({ overwrite: true, new: true });
  //   if (!animal) {
  //     throw new NotFoundException();
  //   }
  //   return animal;
  // }
}
