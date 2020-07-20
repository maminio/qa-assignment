import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  file: string;

  @IsOptional()
  result: string;

  
}
