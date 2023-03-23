import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AnimalType } from 'src/types/animals.type';

export class AnimalDto {
  @ApiProperty({
    description: 'Animal name, can not be empty',
    type: 'string',
    example: 'Cat',
  })
  @IsString()
  @IsNotEmpty()
  animalName: string;

  @ApiProperty({
    description: `One of Animal types - see Enum`,
    enum: AnimalType,
    type: 'AnimalType',
    example: AnimalType.MAMMALS,
  })
  @IsNotEmpty()
  @IsEnum(AnimalType)
  type: AnimalType;

  @ApiPropertyOptional({
    description: 'Optional description',
    type: 'string',
    example: 'test description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
