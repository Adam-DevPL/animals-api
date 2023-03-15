import { Test, TestingModule } from '@nestjs/testing';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';

describe('AnimalsController', () => {
  let controller: AnimalsController;
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [
        AnimalsService,
        {
          provide: ParamsWithId,
          useValue: {
            get: jest.fn().mockResolvedValue('id'),
          },
        },
      ],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
    service = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
