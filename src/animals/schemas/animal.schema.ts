import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';

export type AnimalDocument = HydratedDocument<Animal>;

@Schema()
@ApiTags('animals')
export class Animal {
  @Prop({ required: true })
  @ApiProperty()
  animalName: string;

  @Prop({ required: true })
  @ApiProperty()
  type: AnimalType;

  @Prop({ required: true })
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  description?: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
