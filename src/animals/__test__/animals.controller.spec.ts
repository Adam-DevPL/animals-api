import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsController } from '../animals.controller';
import { AnimalsService } from '../animals.service';
import { AnimalDto, UpdateAnimalDto } from '../dto/animal.dto';
import { Animal } from '../schemas/animal.schema';

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

const animalDto: AnimalDto = {
  animalName: 'Dog',
  type: AnimalType.MAMMALS,
  description: 'new dog created',
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
            findOne: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ _id: id, ...animalStub }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: string, animalData: UpdateAnimalDto) =>
                Promise.resolve({
                  _id: id,
                  createdAt: new Date('2023-03-19T18:27:12.933Z'),
                  ...animalData,
                }),
              ),
            create: jest.fn().mockImplementation((animalData: AnimalDto) =>
              Promise.resolve({
                _id: '507f1f77bcf86cd799439011',
                createdAt: new Date('2023-03-19T18:27:12.933Z'),
                ...animalData,
              }),
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
          id: '507f1f77bcf86cd799439099',
        }),
      ).rejects.toMatchSnapshot();
    });

    it('should throw Internal Server Error Exception when mongodb fail', async () => {
      //given
      jest.spyOn(animalsService, 'findOne').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      //then
      await expect(
        animalsController.getAnimal({
          id: '507f1f77bcf86cd799439099',
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

  describe('updateAnimal', () => {
    it('should update an animal', async () => {
      // given
      const id: ParamsWithId = { id: '507f1f77bcf86cd799439011' }; // example of id, correct with mongodb policy

      //when
      const result = await animalsController.updateAnimal(id, animalUpdate);

      //then
      expect(result.animalName).toEqual(animalUpdate.animalName);
      expect(result.type).toEqual(animalUpdate.type);
      expect(result.description).toEqual(animalUpdate.description);
      expect(result).toMatchSnapshot();
    });

    it('should throw error when animal not found', async () => {
      //given
      jest.spyOn(animalsService, 'update').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(
        animalsController.updateAnimal(
          {
            id: '507f1f77bcf86cd799439099',
          },
          animalUpdate,
        ),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error when id is not mongodb id - BadRequestException', async () => {
      //given
      const incorrectId = { id: 123 };
      const myObject = plainToInstance(ParamsWithId, incorrectId);

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(`id must be a mongodb id`);
    });

    it('should throw error when property type is not AnimalType - BadRequestException', async () => {
      //given
      const incorrectType = { type: 123 };
      const myObject = plainToInstance(UpdateAnimalDto, incorrectType);

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        `type must be one of the following values: MAMMALS, BIRDS, REPTILES, AMPHIBIANS, FISH, INVERTEBRATES`,
      );
    });

    it('should throw Interal Servel Error Exception when something goes worng with mongodb connection', async () => {
      //given
      jest.spyOn(animalsService, 'update').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      //then
      expect(
        animalsController.updateAnimal(
          {
            id: '507f1f77bcf86cd799439099',
          },
          animalUpdate,
        ),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('createAnimal', () => {
    it('should create an animal', async () => {
      //when
      const result = await animalsController.createAnimal(animalDto);

      //then
      expect(result.animalName).toEqual(animalDto.animalName);
      expect(result.type).toEqual(animalDto.type);
      expect(result.description).toEqual(animalDto.description);
      expect(result).toMatchSnapshot();
    });

    it('should throw error - BadRequestException - when animal already exist', async () => {
      //given
      jest.spyOn(animalsService, 'create').mockImplementation(() => {
        throw new BadRequestException('Animal already exist in database');
      });

      //then
      await expect(
        animalsController.createAnimal(animalDto),
      ).rejects.toMatchSnapshot();
    });

    it('should throw error when property type is not AnimalType - BadRequestException', async () => {
      //given
      const incorrectType = { type: 123 };
      const myObject = plainToInstance(AnimalDto, incorrectType);

      //when
      const errors = await validate(myObject);

      //then
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        `type must be one of the following values: MAMMALS, BIRDS, REPTILES, AMPHIBIANS, FISH, INVERTEBRATES`,
      );
    });

    it('should throw Interal Servel Error Exception when something goes worng with mongodb connection', async () => {
      //given
      jest.spyOn(animalsService, 'create').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      //then
      expect(
        animalsController.createAnimal(animalDto),
      ).rejects.toMatchSnapshot();
    });
  });
});
