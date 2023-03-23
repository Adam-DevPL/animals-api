import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Error, Model } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';
import { AnimalsService } from '../animals.service';
import { UpdateAnimalDto } from '../dto/animal.dto';
import { Animal, AnimalDocument } from '../schemas/animal.schema';

const animalStub: Animal = {
  animalName: 'Human',
  type: AnimalType.MAMMALS,
  createdAt: new Date('2023-03-19T18:27:12.933Z'),
  description: 'test description',
};

const animalUpdate: UpdateAnimalDto = {
  animalName: 'Cat',
  type: AnimalType.BIRDS,
  description: 'description after update',
};

describe('AnimalsService', () => {
  let service: AnimalsService;
  let model: Model<AnimalDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getModelToken(Animal.name),
          useValue: {
            find: jest.fn().mockResolvedValue([animalStub]),
            findById: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ _id: id, ...animalStub }),
              ),
            findByIdAndUpdate: jest
              .fn()
              .mockImplementation((id: string, animalData: UpdateAnimalDto) =>
                Promise.resolve({
                  _id: id,
                  createdAt: new Date('2023-03-19T18:27:12.933Z'),
                  ...animalData,
                }),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
    model = module.get<Model<AnimalDocument>>(getModelToken(Animal.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all animals', async () => {
      const result = await service.findAll();
      expect(result).toMatchSnapshot();
    });

    it('should throw Internal Exception Error when something goes wrong with mongodb connection', async () => {
      jest.spyOn(model, 'find').mockImplementation(() => {
        throw new Error('mongodb down');
      });

      expect(service.findAll).rejects.toMatchSnapshot();
    });
  });

  describe('findOne', () => {
    it('should return one animal', async () => {
      const id = '507f1f77bcf86cd799439011';
      const result = await service.findOne(id);
      expect(result).toMatchSnapshot();
    });

    it('should throw error NotFoundException --> Not Found, when animal does not exist', async () => {
      jest.spyOn(model, 'findById').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(
        service.findOne('507f1f77bcf86cd799439099'),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      jest.spyOn(model, 'findById').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      await expect(
        service.findOne('507f1f77bcf86cd799439099'),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('update', () => {
    it('should return updated animal', async () => {
      const id = '507f1f77bcf86cd799439011';
      const result = await service.update(id, animalUpdate);
      expect(result).toMatchSnapshot();
    });

    it('should throw error NotFoundException --> Not Found, when animal does not exist', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(
        service.update('507f1f77bcf86cd799439099', animalUpdate),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      await expect(
        service.update('507f1f77bcf86cd799439099', animalUpdate),
      ).rejects.toMatchSnapshot();
    });
  });
});
