import { IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Teacher } from '../entity/teacher.entity';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  teacher: Teacher;
}
