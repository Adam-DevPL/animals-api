import {
  BadRequestException,
  CACHE_MANAGER,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Error, Model, Types } from 'mongoose';
import { GlobalExceptionFilter } from 'src/filterts/globalexceptions.filter';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { AnimalType } from 'src/types/animals.type';
import { AnimalTypeParam } from 'src/validations/type.validator';
import { AnimalsService } from '../animals.service';
import { AnimalDto, AnimalNameDto, UpdateAnimalDto } from '../dto/animal.dto';
import { Animal, AnimalDocument } from '../schemas/animal.schema';

const animalStub: Animal = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
  animalName: 'Human',
  type: AnimalType.MAMMALS,
  createdAt: new Date('2023-03-19T18:27:12.933Z'),
  description: 'test description',
};

const animalUpdateDto: UpdateAnimalDto = {
  animalName: 'Cat',
  type: AnimalType.BIRDS,
  description: 'description after update',
};

const animalDto: AnimalDto = {
  animalName: 'Dog',
  type: AnimalType.MAMMALS,
  description: 'new dog created',
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

const animalsNamesList: AnimalNameDto[] = [
  {
    animalName: 'Cat',
  },
  {
    animalName: 'Dog',
  },
];

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const mockRequest = {};

describe('AnimalsService', () => {
  let service: AnimalsService;
  let model: Model<AnimalDocument>;
  let filter: GlobalExceptionFilter<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionFilter,

        RedisCacheService,
        AnimalsService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            del: () => 'any value',
          },
        },
        {
          provide: getModelToken(Animal.name),
          useValue: {
            find: jest.fn().mockResolvedValue([animalStub]),
            findOne: jest.fn().mockResolvedValue(null),
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
            create: jest.fn().mockImplementation((animalData: AnimalDto) =>
              Promise.resolve({
                _id: '507f1f77bcf86cd799439011',
                ...animalData,
              }),
            ),
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
    filter = module.get<GlobalExceptionFilter<any>>(GlobalExceptionFilter);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all animals', async () => {
      //when
      const result = await service.findAll();
      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw Internal Exception Error when something goes wrong with mongodb connection', async () => {
      //when
      jest.spyOn(model, 'find').mockImplementation(() => {
        throw new Error('mongodb down');
      });

      //then
      try {
        await service.findAll();
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });

  describe('findOne', () => {
    it('should return one animal', async () => {
      //given
      const id = '507f1f77bcf86cd799439011';

      //when
      const result = await service.findOne(id);

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error NotFoundException --> Not Found, when animal does not exist', async () => {
      //when
      jest.spyOn(model, 'findById').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(async () => {
        await service.findOne('507f1f77bcf86cd799439099');
      }).rejects.toThrowError(NotFoundException);
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      //when
      jest.spyOn(model, 'findById').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      try {
        await service.findOne('507f1f77bcf86cd799439099');
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });

  describe('update', () => {
    it('should return updated animal', async () => {
      //given
      const id = '507f1f77bcf86cd799439011';

      //when
      const result = await service.update(id, animalUpdateDto);

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error NotFoundException --> Not Found, when animal does not exist', async () => {
      //when
      jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(() => {
        throw new NotFoundException();
      });

      //then
      await expect(async () => {
        await service.update('507f1f77bcf86cd799439099', animalUpdateDto);
      }).rejects.toThrowError(NotFoundException);
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      //when
      jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      try {
        await service.update('507f1f77bcf86cd799439099', animalUpdateDto);
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });

  describe('create', () => {
    it('should return newly created animal', async () => {
      //when
      const result = await service.create(animalDto);

      //then
      expect({
        ...result,
        createdAt: new Date('2022-02-02'),
      }).toMatchSnapshot();
    });

    it('should throw error BadRequestException --> Animal already exist in database', async () => {
      //when
      jest.spyOn(model, 'findOne').mockResolvedValue({ _id: 'id' });

      //then
      await expect(async () => {
        await service.create(animalDto);
      }).rejects.toThrowError(BadRequestException);
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      //when
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      try {
        await service.create(animalDto);
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });

  describe('addAnimals', () => {
    it('should return newly created animals', async () => {
      //when
      const result = (await await service.addAnimals(animalsList)).map(
        (res) => ({
          createdAt: (res.createdAt = '2022-02-02'),
          ...res,
        }),
      );

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error BadRequestException --> Animal from the list already exist in db', async () => {
      //when
      jest.spyOn(service, 'findAll').mockImplementation(() =>
        Promise.resolve([
          {
            id: 'id1',
            name: 'Elephant',
            type: AnimalType.MAMMALS,
            createdAt: '2023-03-19T18:27:12.933Z',
            description: 'test description',
          },
          {
            id: 'id2',
            name: 'Lion',
            type: AnimalType.MAMMALS,
            createdAt: '2023-03-19T18:27:12.933Z',
            description: 'test description',
          },
        ]),
      );

      //then
      await expect(async () => {
        await service.addAnimals(animalsList);
      }).rejects.toThrowError(BadRequestException);
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      //when
      jest.spyOn(model, 'insertMany').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      try {
        await service.addAnimals(animalsList);
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });

  describe('addAnimalsWithOneType', () => {
    it('should return newly created animals', async () => {
      //given
      const type: AnimalTypeParam = { type: AnimalType.MAMMALS };

      //when
      const result = (
        await service.addAnimalsWithOneType(animalsNamesList, type)
      ).map((res) => ({
        createdAt: (res.createdAt = '2022-02-02'),
        ...res,
      }));

      //then
      expect(result).toMatchSnapshot();
    });

    it('should throw error BadRequestException --> Animal from the list already exist in db', async () => {
      //given
      const type: AnimalTypeParam = { type: AnimalType.MAMMALS };

      //when
      jest.spyOn(service, 'findAll').mockImplementation(() =>
        Promise.resolve([
          {
            id: 'id1',
            name: 'Cat',
            type: AnimalType.MAMMALS,
            createdAt: '2023-03-19T18:27:12.933Z',
            description: 'test description',
          },
          {
            id: 'id2',
            name: 'Dog',
            type: AnimalType.MAMMALS,
            createdAt: '2023-03-19T18:27:12.933Z',
            description: 'test description',
          },
        ]),
      );

      //then
      await expect(async () => {
        await service.addAnimalsWithOneType(animalsNamesList, type);
      }).rejects.toThrowError(BadRequestException);
    });

    it('should throw error InternalServerErrorException when mongodb fails', async () => {
      //given
      const type: AnimalTypeParam = { type: AnimalType.MAMMALS };

      //when
      jest.spyOn(model, 'insertMany').mockImplementation(() => {
        throw new Error('mongo fails');
      });

      //then
      try {
        await service.addAnimalsWithOneType(animalsNamesList, type);
      } catch (err) {
        filter.catch(err, {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
          }),
        } as any);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Unexpected error. Sorry for a trouble',
          status: 500,
        });
      }
    });
  });
});
