import { IsString } from 'class-validator';

export class CategoryCreateDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
