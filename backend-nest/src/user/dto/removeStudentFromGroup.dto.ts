import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveStudentFromGroupDto {
  @IsInt()
  @IsNotEmpty()
  idStudent: number;
}
