import { Types } from 'mongoose';

export enum AnimalType {
  MAMMALS = 'MAMMALS',
  BIRDS = 'BIRDS',
  REPTILES = 'REPTILES',
  AMPHIBIANS = 'AMPHIBIANS',
  FISH = 'FISH',
  INVERTEBRATES = 'INVERTEBRATES',
}

export type AddAnimalsListResponse = {
  _id: Types.ObjectId;
};

export interface AnimalResponse {
  _id: string;
  animalName: string;
  type: AnimalType;
  description?: string;
  createdAt: Date;
}
