import { IsInt, IsNotEmpty } from 'class-validator';

export class AddStudentToGroupDto {
  @IsInt()
  @IsNotEmpty()
  idStudent: number;
}
