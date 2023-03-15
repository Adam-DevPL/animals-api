import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ParamsWithId } from 'src/validations/id.validator';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('/all')
  async getAllPosts() {
    return this.animalsService.findAll();
  }

  @Get('animal/:id')
  async getPost(@Param() { id }: ParamsWithId) {
    return this.animalsService.findOne(id);
  }

  @Post('/add')
  async createPost(@Body() post: AnimalDto) {
    return this.animalsService.create(post);
  }

  @Put('animal/:id')
  async updatePost(@Param() { id }: ParamsWithId, @Body() post: AnimalDto) {
    return this.animalsService.update(id, post);
  }
}
