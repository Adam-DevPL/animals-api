import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('/all')
  async getAllAnimals() {
    return this.animalsService.findAll();
  }

  // @Get('animal/:id')
  // async getAnimal(@Param() { id }: ParamsWithId) {
  //   return this.animalsService.findOne(id);
  // }

  // @Post('/add')
  // async createAnimal(@Body() animal: AnimalDto) {
  //   return this.animalsService.create(animal);
  // }

  // @Put('animal/:id')
  // async updateAnimal(@Param() { id }: ParamsWithId, @Body() animal: AnimalDto) {
  //   return this.animalsService.update(id, animal);
  // }
}
