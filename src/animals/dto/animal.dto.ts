import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';

export class AnimalDto {
  @IsString()
  @IsNotEmpty()
  animalName: string;

  @IsNotEmpty()
  @IsEnum(AnimalType)
  type: AnimalType;

  @IsOptional()
  @IsString()
  description?: string;
}
