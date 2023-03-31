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
import {
  AnimalDto,
  UpdateAnimalDto,
  AnimalNameDto,
  AnimalDtoResponse,
} from './dto/animal.dto';
import { Animal, AnimalDocument } from './schemas/animal.schema';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    private readonly redisCacheManager: RedisCacheService,
  ) {}

  async findAll(): Promise<AnimalDtoResponse[]> {
    try {
      const animals: Animal[] = await this.animalModel.find();
      return AnimalDtoResponse.mapperArrayDto(animals);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<AnimalDtoResponse> {
    try {
      const animal: AnimalDocument = await this.animalModel.findById({
        _id: new Types.ObjectId(id),
      });

      if (!animal) {
        throw new NotFoundException('Animal was not found in database');
      }

      return AnimalDtoResponse.mapperDto(animal);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async update(
    id: string,
    animalData: UpdateAnimalDto,
  ): Promise<AnimalDtoResponse> {
    try {
      const animal: AnimalDocument = await this.animalModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        animalData,
        {
          new: true,
        },
      );

      if (!animal) {
        throw new NotFoundException('Animal with given id does not exist');
      }

      await this.redisCacheManager.clearCache(animal._id.toString());

      return AnimalDtoResponse.mapperDto(animal);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async create(animalData: AnimalDto): Promise<AnimalDtoResponse> {
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

      return AnimalDtoResponse.mapperDto(newAnimal);
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async addAnimals(animalsList: AnimalDto[]): Promise<AnimalDtoResponse[]> {
    try {
      const allAnimals: AnimalDtoResponse[] = await this.findAll();
      const alreadyExistAnimals: AnimalDto[] = animalsList.filter((animal) =>
        allAnimals.some(
          ({ name, type }) =>
            animal.animalName === name && animal.type === type,
        ),
      );
      if (alreadyExistAnimals.length !== 0) {
        throw new BadRequestException('Animals already exist in database');
      }

      await this.redisCacheManager.clearCache();

      const animals: Animal[] = await this.animalModel.insertMany(
        animalsList.map((animal) => ({ createdAt: new Date(), ...animal })),
      );

      return AnimalDtoResponse.mapperArrayDto(animals);
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
  async addAnimalsWithOneType(
    animalsNames: AnimalNameDto[],
    typeAnimal: AnimalTypeParam,
  ): Promise<AnimalDtoResponse[]> {
    try {
      const allAnimals: AnimalDtoResponse[] = await this.findAll();
      const alreadyExistAnimals: AnimalNameDto[] = animalsNames.filter(
        (animal) =>
          allAnimals.some(
            ({ name, type }) =>
              animal.animalName === name && typeAnimal.type === type,
          ),
      );
      if (alreadyExistAnimals.length !== 0) {
        throw new BadRequestException('Animals already exist in database');
      }

      await this.redisCacheManager.clearCache();

      const animals: Animal[] = await this.animalModel.insertMany(
        animalsNames.map((animal) => ({
          createdAt: new Date(),
          animalName: animal.animalName,
          type: typeAnimal.type,
        })),
      );

      return AnimalDtoResponse.mapperArrayDto(animals);
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
