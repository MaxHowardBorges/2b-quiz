import { Injectable } from '@nestjs/common';
import { TeacherGroupDataDto } from '../dto/teacherGroupData.dto';
import { Teacher } from '../entity/teacher.entity';
import { TeacherGroupDto } from '../dto/teacherGroup.dto';

@Injectable()
export class TeacherMapper {
  teacherToTeacherGroupDataDtoMap(user: Teacher) {
    const dto = new TeacherGroupDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.name = user.name;
    dto.surname = user.surname;
    return dto;
  }
}
