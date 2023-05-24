import { IsString } from 'class-validator';

export class SubCategoryCreateDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
