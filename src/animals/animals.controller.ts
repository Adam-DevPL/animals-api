import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsService } from './animals.service';
import { AnimalDto, AnimalDtoArray, UpdateAnimalDto } from './dto/animal.dto';
import { ErrorDto } from './dto/error.dto';
import { AnimalWithId } from './schemas/animal.schema';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all animals from the api' })
  @ApiOkResponse({
    description: 'Get all data',
    type: [AnimalWithId],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getAllAnimals(): Promise<AnimalWithId[]> {
    return this.animalsService.findAll();
  }

  @Get('animal/:id')
  @ApiParam({
    name: 'id',
    description: 'Gets the Animal id',
  })
  @ApiOperation({ summary: 'Get an animal with a given id' })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: AnimalWithId,
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
  async getAnimal(@Param() { id }: ParamsWithId) {
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
    type: AnimalWithId,
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
    @Param() { id }: ParamsWithId,
    @Body() animal: UpdateAnimalDto,
  ) {
    return this.animalsService.update(id, animal);
  }

  @Post('add')
  @ApiBody({ type: AnimalDto })
  @ApiOperation({ summary: 'Create a new animal' })
  @ApiCreatedResponse({
    description: 'The animal was created successfully',
    type: AnimalWithId,
  })
  @ApiBadRequestResponse({
    description: 'Incorrect  data or data already exist - BadRequest',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async createAnimal(@Body() animal: AnimalDto) {
    return this.animalsService.create(animal);
  }

  @Post('add/animals')
  @ApiBody({ type: [AnimalDto] })
  @ApiOperation({ summary: 'Add a list of animals' })
  @ApiCreatedResponse({
    description: 'The list of animals added successfully',
    type: [AnimalWithId],
  })
  @ApiBadRequestResponse({
    description: 'Incorrect  data or data already exist - BadRequest',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorDto,
  })
  async addAnimalsList(@Body() { animals }: AnimalDtoArray) {
    return this.animalsService.addAnimals(animals);
  }
}
