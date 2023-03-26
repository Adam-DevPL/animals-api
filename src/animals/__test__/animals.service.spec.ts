import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';
import { AnimalsService } from '../animals.service';
import { AnimalDto } from '../dto/animal.dto';
import { Animal, AnimalDocument } from '../schemas/animal.schema';

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
            findById: jest.fn().mockResolvedValue(animalStub),
            insertMany: jest.fn().mockImplementation((animals: AnimalDto[]) =>
              Promise.resolve([
                {
                  _id: 'id1',
                  ...animals[0],
                },
                {
                  _id: 'id2',
                  ...animals[1],
                },
              ]),
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
        service.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('addAnimals', () => {
    it('should return newly created animals', async () => {
      //when
      const result = (await await service.addAnimals(animalsList)).map(
        (res) => ({
          createdAt: (res.createdAt = new Date('2022-02-02')),
          ...res,
        }),
      );

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error BadRequestException --> Animal from the list already exist in db', async () => {
      //given
      jest.spyOn(model, 'find').mockResolvedValue([
        {
          animalName: 'Elephant',
          type: AnimalType.MAMMALS,
          createdAt: new Date('2023-03-19T18:27:12.933Z'),
          description: 'test description',
        },
        {
          animalName: 'Lion',
          type: AnimalType.MAMMALS,
          createdAt: new Date('2023-03-19T18:27:12.933Z'),
          description: 'test description',
        },
      ]);

      //then
      await expect(service.addAnimals(animalsList)).rejects.toMatchSnapshot();
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      jest.spyOn(model, 'insertMany').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      await expect(service.addAnimals(animalsList)).rejects.toMatchSnapshot();
    });
  });
});
