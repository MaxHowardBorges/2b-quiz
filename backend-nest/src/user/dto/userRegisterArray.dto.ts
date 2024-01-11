import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRegisterDto } from './userRegister.dto';

export class UserRegisterArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRegisterDto)
  users: UserRegisterDto[];
}
