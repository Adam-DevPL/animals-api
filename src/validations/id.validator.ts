import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AnimalIdParam {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
