import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalTypeParam } from 'src/validations/type.validator';
import { AnimalsService } from './animals.service';
import { AnimalNameArrayDto } from './dto/animal.dto';
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
  async getAllAnimals() {
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
    type: [AnimalWithId],
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
  ) {
    return this.animalsService.addAnimalsWithOneType(animalsNames, type);
  }
}
