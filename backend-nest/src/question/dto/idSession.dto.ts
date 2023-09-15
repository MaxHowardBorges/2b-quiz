import { IsNumber } from 'class-validator';

export class UserUpdateDto {
  @IsNumber()
  id: number;

}