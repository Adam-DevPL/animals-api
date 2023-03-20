import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';

export class AnimalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  animalName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AnimalType)
  type: AnimalType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
