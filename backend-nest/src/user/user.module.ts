import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Teacher } from './entity/teacher.entity';
import { Student } from './entity/student.entity';
import { Admin } from './entity/admin.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserMapper } from './mapper/user.mapper';
import { Group } from './entity/group.entity';
import { GroupController } from './controller/group.controller';
import { GroupMapper } from './mapper/group.mapper';

@Module({
  providers: [UserService, UserMapper, GroupMapper],
  imports: [TypeOrmModule.forFeature([User, Teacher, Student, Admin, Group])],
  exports: [UserService],
  controllers: [UserController, GroupController],
})
export class UserModule {}
