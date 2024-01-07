import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Teacher } from './entity/teacher.entity';
import { Student } from './entity/student.entity';
import { Admin } from './entity/admin.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserMapper } from './mapper/user.mapper';

@Module({
  providers: [UserService, UserMapper],
  imports: [TypeOrmModule.forFeature([User, Teacher, Student, Admin])],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
