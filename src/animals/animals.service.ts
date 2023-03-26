import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnimalDto } from './dto/animal.dto';
import { Animal, AnimalDocument, AnimalWithId } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async findAll() {
    try {
      return this.animalModel.find();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const animal: AnimalDocument = await this.animalModel.findById({
        _id: new Types.ObjectId(id),
      });
      if (!animal) {
        throw new NotFoundException();
      }
      return animal as AnimalWithId;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async addAnimals(animalsList: AnimalDto[]) {
    try {
      const allAnimals: AnimalWithId[] = await this.findAll();
      console.log(allAnimals);
      const uniqueAnimals = animalsList.filter((animal) =>
        allAnimals.every(
          ({ animalName, type }) =>
            animal.animalName !== animalName && animal.type !== type,
        ),
      );
      console.log(uniqueAnimals);
      if (uniqueAnimals.length === 0) {
        throw new BadRequestException(
          'No animals has been sent or animals already exist in database',
        );
      }
      return await this.animalModel.insertMany(
        uniqueAnimals.map((animal) => ({ createdAt: new Date(), ...animal })),
      );
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
