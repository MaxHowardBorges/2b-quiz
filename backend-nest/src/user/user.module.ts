import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Teacher } from './entity/teacher.entity';
import { Admin } from 'typeorm';
import { Student } from './entity/student.entity';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Teacher, Student, Admin])],
})
export class UserModule {}
