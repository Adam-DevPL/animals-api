import { IsEnum, IsNotEmpty } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';

export class AnimalTypeParam {
  @IsNotEmpty()
  @IsEnum(AnimalType)
  type: AnimalType;
}
