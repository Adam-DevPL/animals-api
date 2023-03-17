import { Animal } from 'src/animals/schemas/animal.schema';
import { AnimalType } from 'src/types/animals.type';

export const animalStub = (): Animal => {
  return {
    animalName: 'Human',
    type: AnimalType.MAMMALS,
    description: 'test description',
    createdAt: new Date(),
  };
};
