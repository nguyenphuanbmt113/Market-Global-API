import { IsString } from 'class-validator';

export class SubCategoryUpdateDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
