import { animalStub } from '../stubs/animal.stub';

export const AnimalsService = jest.fn().mockReturnValue({
  getAnimal: jest.fn().mockResolvedValue(animalStub()),
  getAllAnimals: jest.fn().mockResolvedValue([animalStub()]),
  createAnimal: jest.fn().mockResolvedValue(animalStub()),
  updateAnimal: jest.fn().mockResolvedValue(animalStub()),
});
