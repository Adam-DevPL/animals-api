import {
  Body,
  CacheKey,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AnimalType } from 'src/types/animals.type';
import { AnimalIdParam } from 'src/validations/id.validator';
import { AnimalTypeParam } from 'src/validations/type.validator';
import { AnimalsService } from './animals.service';
import {
  AnimalDto,
  AnimalDtoArray,
  UpdateAnimalDto,
  AnimalNameArrayDto,
} from './dto/animal.dto';
import { ErrorDto } from './dto/error.dto';
import { Animal } from './schemas/animal.schema';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @CacheKey('findAll')
  @Get('/all')
  @ApiOperation({ summary: 'Get all animals from the api' })
  @ApiOkResponse({
    description: 'Get all data',
    type: [Animal],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getAllAnimals(): Promise<Animal[]> {
    return this.animalsService.findAll();
  }

  @CacheKey('findOne')
  @Get('animal/:id')
  @ApiParam({
    name: 'id',
    description: 'Gets the Animal id',
  })
  @ApiOperation({ summary: 'Get an animal with a given id' })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Animal,
  })
  @ApiBadRequestResponse({
    description: 'Incorrect id number',
    type: ErrorDto,
  })
  @ApiNotFoundResponse({ description: 'Animal not found', type: ErrorDto })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getAnimal(@Param() { id }: AnimalIdParam): Promise<Animal> {
    return this.animalsService.findOne(id);
  }

  @Patch('animal/:id')
  @ApiParam({
    name: 'id',
    description: 'id from database',
  })
  @ApiBody({ type: UpdateAnimalDto })
  @ApiOperation({ summary: 'Get an animal and will update' })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Animal,
  })
  @ApiBadRequestResponse({
    description: 'Incorrect id number',
    type: ErrorDto,
  })
  @ApiNotFoundResponse({ description: 'Animal not found', type: ErrorDto })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async updateAnimal(
    @Param() { id }: AnimalIdParam,
    @Body() animal: UpdateAnimalDto,
  ): Promise<Animal> {
    return this.animalsService.update(id, animal);
  }

  @Post('add')
  @ApiBody({ type: AnimalDto })
  @ApiOperation({ summary: 'Create a new animal' })
  @ApiCreatedResponse({
    description: 'The animal was created successfully',
    type: Animal,
  })
  @ApiBadRequestResponse({
    description: 'Incorrect  data or data already exist - BadRequest',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async createAnimal(@Body() animal: AnimalDto): Promise<Animal> {
    return this.animalsService.create(animal);
  }

  @Post('add/animals')
  @ApiBody({ type: [AnimalDto] })
  @ApiOperation({ summary: 'Add a list of animals' })
  @ApiCreatedResponse({
    description: 'The list of animals added successfully',
    type: [Animal],
  })
  @ApiBadRequestResponse({
    description: 'Incorrect  data or data already exist - BadRequest',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async addAnimalsList(@Body() { animals }: AnimalDtoArray): Promise<Animal[]> {
    return this.animalsService.addAnimals(animals);
  }

  @Post('add/:type')
  @ApiBody({ type: AnimalNameArrayDto })
  @ApiParam({
    name: 'type',
    description: 'Gets the Animal type',
    enum: AnimalType,
  })
  @ApiOperation({ summary: 'Add a list of animals of one type' })
  @ApiCreatedResponse({
    description: 'The list of animals added successfully',
    type: [Animal],
  })
  @ApiBadRequestResponse({
    description: 'Incorrect data or data already exist - BadRequest',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async addAnimalsListWithType(
    @Body() { animalsNames }: AnimalNameArrayDto,
    @Param() type: AnimalTypeParam,
  ): Promise<Animal[]> {
    return this.animalsService.addAnimalsWithOneType(animalsNames, type);
  }
}
