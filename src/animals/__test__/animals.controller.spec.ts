import { Test, TestingModule } from '@nestjs/testing';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsController } from '../animals.controller';
import { AnimalsService } from '../animals.service';
import { Animal } from '../schemas/animal.schema';

jest.mock('../animals.service');

describe('AnimalsController', () => {
  let controller: AnimalsController;
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [AnimalsService],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
    service = module.get<AnimalsService>(AnimalsService);
    jest.clearAllMocks();
  });

  describe('getAnimal', () => {
    describe('when getAnimal is called', () => {
      let animals: Animal[];

      beforeEach(async () => {
        const id = new ParamsWithId();
        animals = await controller.getAllAnimals();
      });

      it('should call animalsService', () => {
        expect(service.findAll).toBeCalled();
      });
    });
  });
});
