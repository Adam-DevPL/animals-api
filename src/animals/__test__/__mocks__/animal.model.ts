import { Animal } from 'src/animals/schemas/animal.schema';
import { animalStub } from '../stubs/animal.stub';
import { MockModel } from './mock.model';

export class AnimalModel extends MockModel<Animal> {
  protected animalModelStub = animalStub();
}
