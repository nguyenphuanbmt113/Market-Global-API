import { IsString } from 'class-validator';

export class CategoryUpdateDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
