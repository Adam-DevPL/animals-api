import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamsWithId {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
