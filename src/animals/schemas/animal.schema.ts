import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AnimalType } from 'src/types/animals.type';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @Prop({ required: true })
  animalName: string;

  @Prop({ required: true })
  type: AnimalType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  description?: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
