import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { AnimalType } from 'src/types/animals.type';

export class AnimalNameDto {
  @ApiProperty({
    description: 'Animal name, can not be empty',
    type: 'string',
    example: 'Cat',
  })
  @IsString()
  @IsNotEmpty()
  animalName: string;
}

export class AnimalDto extends AnimalNameDto {
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

export class UpdateAnimalDto extends PartialType(AnimalDto) {}

// export class UpdateAnimalDto {
//   @ApiPropertyOptional({
//     description: 'Animal name',
//     type: 'string',
//     example: 'Cat',
//   })
//   @IsOptional()
//   @IsString()
//   animalName?: string;

//   @ApiPropertyOptional({
//     description: `One of Animal types - see Enum`,
//     enum: AnimalType,
//     type: 'AnimalType',
//     example: AnimalType.MAMMALS,
//   })
//   @Optional()
//   @IsEnum(AnimalType)
//   type?: AnimalType;

//   @ApiPropertyOptional({
//     description: 'Optional description',
//     type: 'string',
//     example: 'test description',
//   })
//   @IsOptional()
//   @IsString()
//   description?: string;
// }

export class AnimalDtoArray {
  @ApiProperty({ description: 'Array with animals', type: [AnimalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnimalDto)
  animals: AnimalDto[];
}

export class AnimalNameArrayDto {
  @ApiProperty({
    description: 'Array with animals names only',
    type: [AnimalNameDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnimalNameDto)
  animalsNames: AnimalNameDto[];
}
