import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AnimalType } from 'src/types/animals.type';
import { AnimalsController } from '../animals.controller';
import { AnimalsService } from '../animals.service';
import { Animal } from '../schemas/animal.schema';

const animalStub: Animal = {
  animalName: 'Human',
  type: AnimalType.MAMMALS,
  createdAt: new Date('2023-03-19T18:27:12.933Z'),
  description: 'test description',
};

describe('AnimalsController', () => {
  let animalsController: AnimalsController;
  let animalsService: AnimalsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [
        AnimalsService,
        {
          provide: AnimalsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([animalStub]),
          },
        },
      ],
    }).compile();

    animalsController = moduleRef.get<AnimalsController>(AnimalsController);
    animalsService = moduleRef.get<AnimalsService>(AnimalsService);
  });

  describe('getAllAnimals', () => {
    it('should return an array of animals', async () => {
      const result = await animalsController.getAllAnimals();
      expect(result).toMatchSnapshot();
    });
  });
});
