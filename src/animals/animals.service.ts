import {
  BadRequestException,
  Injectable,
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
    const animals: Animal[] = await this.animalModel.find();
    return AnimalDtoResponse.mapperArrayDto(animals);
  }

  async findOne(id: string): Promise<AnimalDtoResponse> {
    const animal: AnimalDocument = await this.animalModel.findById({
      _id: new Types.ObjectId(id),
    });

    if (!animal) {
      throw new NotFoundException('Animal was not found in database');
    }

    return AnimalDtoResponse.mapperDto(animal);
  }

  async update(
    id: string,
    animalData: UpdateAnimalDto,
  ): Promise<AnimalDtoResponse> {
    const animal: AnimalDocument = await this.animalModel.findByIdAndUpdate(
      { _id: { $eq: new Types.ObjectId(id) } },
      animalData,
      {
        new: true,
      },
    );

    if (!animal) {
      throw new NotFoundException('Animal with given id does not exist');
    }

    await this.redisCacheManager.clearAllCache();
    await this.redisCacheManager.clearSingleCache(animal._id.toString());

    return AnimalDtoResponse.mapperDto(animal);
  }

  async create(animalData: AnimalDto): Promise<AnimalDtoResponse> {
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

    await this.redisCacheManager.clearAllCache();

    return AnimalDtoResponse.mapperDto(newAnimal);
  }

  async addAnimals(animalsList: AnimalDto[]): Promise<AnimalDtoResponse[]> {
    const allAnimals: AnimalDtoResponse[] = await this.findAll();

    const alreadyExistAnimals: AnimalDto[] = animalsList.filter((animal) =>
      allAnimals.some(
        ({ name, type }) => animal.animalName === name && animal.type === type,
      ),
    );

    if (alreadyExistAnimals.length !== 0) {
      throw new BadRequestException('Animals already exist in database');
    }

    await this.redisCacheManager.clearAllCache();

    const animals: Animal[] = await this.animalModel.insertMany(
      animalsList.map((animal) => ({ createdAt: new Date(), ...animal })),
    );

    return AnimalDtoResponse.mapperArrayDto(animals);
  }
  async addAnimalsWithOneType(
    animalsNames: AnimalNameDto[],
    typeAnimal: AnimalTypeParam,
  ): Promise<AnimalDtoResponse[]> {
    const allAnimals: AnimalDtoResponse[] = await this.findAll();
    const alreadyExistAnimals: AnimalNameDto[] = animalsNames.filter((animal) =>
      allAnimals.some(
        ({ name, type }) =>
          animal.animalName === name && typeAnimal.type === type,
      ),
    );

    if (alreadyExistAnimals.length !== 0) {
      throw new BadRequestException('Animals already exist in database');
    }

    await this.redisCacheManager.clearAllCache();

    const animals: Animal[] = await this.animalModel.insertMany(
      animalsNames.map((animal) => ({
        createdAt: new Date(),
        animalName: animal.animalName,
        type: typeAnimal.type,
      })),
    );

    return AnimalDtoResponse.mapperArrayDto(animals);
  }
}
