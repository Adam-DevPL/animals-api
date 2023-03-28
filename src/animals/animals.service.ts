import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { AnimalTypeParam } from 'src/validations/type.validator';
import { AnimalDto, UpdateAnimalDto, AnimalNameDto } from './dto/animal.dto';
import { Animal, AnimalDocument } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    private readonly redisCacheManager: RedisCacheService,
  ) {}

  async findAll(): Promise<Animal[]> {
    try {
      return await this.animalModel.find();
    } catch (err) {
      // console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Animal> {
    try {
      const animal: AnimalDocument = await this.animalModel.findById({
        _id: new Types.ObjectId(id),
      });

      if (!animal) {
        throw new NotFoundException();
      }
      return animal;
    } catch (err) {
      // console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, animalData: UpdateAnimalDto): Promise<Animal> {
    try {
      const animal: AnimalDocument = await this.animalModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        animalData,
        {
          new: true,
        },
      );

      if (!animal) {
        throw new NotFoundException();
      }

      await this.redisCacheManager.clearCache();
      return animal;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async create(animalData: AnimalDto): Promise<Animal> {
    try {
      const animal: AnimalDocument = await this.animalModel.findOne({
        animalName: { $eq: animalData.animalName },
        animalType: { $eq: animalData.type },
      });

      if (animal) {
        throw new BadRequestException('Animal already exist in database');
      }

      const newAnimal: AnimalDocument = await this.animalModel.create({
        createdAt: new Date(),
        ...animalData,
      });

      await this.redisCacheManager.clearCache();

      return newAnimal;
    } catch (err) {
      // console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async addAnimals(animalsList: AnimalDto[]): Promise<Animal[]> {
    try {
      const allAnimals: Animal[] = await this.findAll();
      const alreadyExistAnimals: AnimalDto[] = animalsList.filter((animal) =>
        allAnimals.some(
          ({ animalName, type }) =>
            animal.animalName === animalName && animal.type === type,
        ),
      );
      if (alreadyExistAnimals.length !== 0) {
        throw new BadRequestException('Animals already exist in database');
      }

      await this.redisCacheManager.clearCache();

      return await this.animalModel.insertMany(
        animalsList.map((animal) => ({ createdAt: new Date(), ...animal })),
      );
    } catch (err) {
      // console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
  async addAnimalsWithOneType(
    animalsNames: AnimalNameDto[],
    typeAnimal: AnimalTypeParam,
  ): Promise<Animal[]> {
    try {
      const allAnimals: Animal[] = await this.findAll();
      const alreadyExistAnimals: AnimalNameDto[] = animalsNames.filter(
        (animal) =>
          allAnimals.some(
            ({ animalName, type }) =>
              animal.animalName === animalName && typeAnimal.type === type,
          ),
      );
      if (alreadyExistAnimals.length !== 0) {
        throw new BadRequestException('Animals already exist in database');
      }

      await this.redisCacheManager.clearCache();

      return await this.animalModel.insertMany(
        animalsNames.map((animal) => ({
          createdAt: new Date(),
          animalName: animal.animalName,
          type: typeAnimal.type,
        })),
      );
    } catch (err) {
      // console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
