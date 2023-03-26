import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsController } from '../animals.controller';
import { AnimalsService } from '../animals.service';
import { AnimalDto, AnimalDtoArray } from '../dto/animal.dto';
import { Animal } from '../schemas/animal.schema';

const animalStub: Animal = {
  animalName: 'Human',
  type: AnimalType.MAMMALS,
  createdAt: new Date('2023-03-19T18:27:12.933Z'),
  description: 'test description',
};

const animalsList: AnimalDto[] = [
  {
    animalName: 'Elephant',
    type: AnimalType.MAMMALS,
  },
  {
    animalName: 'Lion',
    type: AnimalType.MAMMALS,
  },
];

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
            addAnimals: jest.fn().mockImplementation((animals) =>
              Promise.resolve([
                {
                  _id: 'id1',
                  createdAt: '2022-02-02',
                  ...animals[0],
                },
                {
                  _id: 'id2',
                  createdAt: '2022-02-02',
                  ...animals[1],
                },
              ]),
            ),
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

  describe('addAnimalsLsit', () => {
    it('should add list of animals', async () => {
      //given
      const animalDtoArray = {
        animals: animalsList,
      };
      //when
      const result = await animalsController.addAnimalsList(animalDtoArray);

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error - BadRequestException - when one of animals already exist', async () => {
      //given
      const animalDtoArray = {
        animals: animalsList,
      };
      jest.spyOn(animalsService, 'addAnimals').mockImplementation(() => {
        throw new BadRequestException('Animals already exist in database');
      });

      //then
      await expect(
        animalsController.addAnimalsList(animalDtoArray),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error when no array as an entry DTO- BadRequestException', async () => {
      //given
      const incorrectType = { type: 123 };
      const myObject = plainToInstance(AnimalDtoArray, incorrectType);

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(`animals must be an array`);
    });

    it('should throw Interal Servel Error Exception when something goes worng with mongodb connection', async () => {
      //given
      const animalDtoArray = {
        animals: animalsList,
      };
      jest.spyOn(animalsService, 'addAnimals').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      //then
      expect(
        animalsController.addAnimalsList(animalDtoArray),
      ).rejects.toMatchSnapshot();
    });
  });
});
