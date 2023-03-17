import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from '../animals.service';
import { Animal } from '../schemas/animal.schema';
import { AnimalModel } from './__mocks__/animal.model';

describe('AnimalsService', () => {
  let service: AnimalsService;
  let model: AnimalModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getModelToken(Animal.name),
          useClass: AnimalModel,
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
    model = module.get<AnimalModel>(getModelToken(Animal.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
