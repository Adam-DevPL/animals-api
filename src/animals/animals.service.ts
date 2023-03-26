import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';
import { AnimalTypeParam } from 'src/validations/type.validator';
import { AnimalDto, AnimalNameDto } from './dto/animal.dto';
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
  async addAnimalsWithOneType(
    animalsNames: AnimalNameDto[],
    typeAnimal: AnimalTypeParam,
  ) {
    try {
      const allAnimals: AnimalWithId[] = await this.findAll();
      const alreadyExistAnimals = animalsNames.filter((animal) =>
        allAnimals.some(
          ({ animalName, type }) =>
            animal.animalName === animalName && typeAnimal.type === type,
        ),
      );
      if (alreadyExistAnimals.length !== 0) {
        throw new BadRequestException('Animals already exist in database');
      }
      return await this.animalModel.insertMany(
        animalsNames.map((animal) => ({
          createdAt: new Date(),
          animalName: animal.animalName,
          type: typeAnimal.type,
        })),
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
