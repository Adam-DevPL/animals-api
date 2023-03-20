import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animal.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all animals from the api' })
  @ApiResponse({ status: 200, description: 'Get all data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAnimals() {
    return this.animalsService.findAll();
  }

  @Get('animal/:id')
  @ApiParam({
    name: 'id',
    description: 'Gets the Animal id',
  })
  @ApiOperation({ summary: 'Get an animal with a given id' })
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiBadRequestResponse({ description: 'Incorrect id number' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAnimal(@Param() { id }: ParamsWithId) {
    return this.animalsService.findOne(id);
  }

  // @Post('/add')
  // async createAnimal(@Body() animal: AnimalDto) {
  //   return this.animalsService.create(animal);
  // }

  // @Put('animal/:id')
  // async updateAnimal(@Param() { id }: ParamsWithId, @Body() animal: AnimalDto) {
  //   return this.animalsService.update(id, animal);
  // }
}
