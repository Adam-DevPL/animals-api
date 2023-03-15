import { Test, TestingModule } from '@nestjs/testing';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsController } from './animals.controller';

describe('AnimalsController', () => {
  let controller: AnimalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ParamsWithId],
      controllers: [AnimalsController],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
