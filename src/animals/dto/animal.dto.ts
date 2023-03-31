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
import { Types } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';
import { Animal } from '../schemas/animal.schema';

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

export class AnimalDtoResponse {
  id: string;
  name: string;
  type: AnimalType;
  createdAt: string;
  description?: string;

  constructor(
    id: Types.ObjectId,
    name: string,
    type: AnimalType,
    createdAt: Date,
    description?: string,
  ) {
    this.id = id.toString();
    this.name = this.name = name;
    this.type = type;
    this.createdAt = createdAt.toUTCString();
    this.description = description;
  }

  static mapperDto(data: Animal): AnimalDtoResponse {
    return new AnimalDtoResponse(
      data._id,
      data.animalName,
      data.type,
      data.createdAt,
      data.description,
    );
  }

  static mapperArrayDto(data: Animal[]): AnimalDtoResponse[] {
    return data.map((element) => {
      return this.mapperDto(element);
    });
  }
}
