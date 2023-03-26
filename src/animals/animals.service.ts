import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnimalDto, UpdateAnimalDto } from './dto/animal.dto';
import { Animal, AnimalDocument, AnimalWithId } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async findAll() {
    try {
      return (await this.animalModel.find({})) as AnimalWithId[];
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

  async update(id: string, animalData: UpdateAnimalDto) {
    try {
      const animal: AnimalDocument = await this.animalModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        animalData,
        { new: true },
      );

      if (!animal) {
        throw new NotFoundException();
      }

      return animal as AnimalWithId;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async create(animalData: AnimalDto) {
    try {
      const animal: AnimalDocument = await this.animalModel.findOne({
        animalName: { $q: animalData.animalName },
        animalType: { $q: animalData.type },
      });

      if (animal) {
        throw new BadRequestException('Animal already exist in database');
      }

      const newAnimal: AnimalDocument = await this.animalModel.create({
        createdAt: new Date(),
        ...animalData,
      });

      return newAnimal as AnimalWithId;
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
