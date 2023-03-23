import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';
import { ParamsWithId } from 'src/validations/id.validator';
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
            findOne: jest.fn().mockResolvedValue(animalStub),
          },
        },
      ],
    }).compile();

    animalsController = moduleRef.get<AnimalsController>(AnimalsController);
    animalsService = moduleRef.get<AnimalsService>(AnimalsService);
  });

  describe('getAllAnimals', () => {
    it('should return an array of animals', async () => {
      //whem
      const result = await animalsController.getAllAnimals();

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw an error when there is something wrong with mongodb connection', async () => {
      jest.spyOn(animalsService, 'findAll').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      expect(animalsController.getAllAnimals()).rejects.toMatchSnapshot();
    });
  });

  describe('getAnimal', () => {
    it('should return an animal', async () => {
      // given
      const id: ParamsWithId = { id: '507f1f77bcf86cd799439011' }; // example of id, correct with mongodb policy

      //when
      const result = await animalsController.getAnimal(id);

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error when animal not found', async () => {
      //given
      jest.spyOn(animalsService, 'findOne').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(
        animalsController.getAnimal({
          id: '507f1f77bcf86cd799439011',
        }),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error when id is not mongodb id', async () => {
      //given
      const incorrectId = { id: 123 };
      const myObject = plainToInstance(ParamsWithId, incorrectId);

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(`id must be a mongodb id`);
    });
  });
});
