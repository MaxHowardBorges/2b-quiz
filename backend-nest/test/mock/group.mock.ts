import { faker } from '@faker-js/faker/locale/fr';
import { Group } from '../../src/user/entity/group.entity';
import {
  generateRandomStudentTeacherMockList,
  generateTeacherMock,
} from './user.mock';

export function generateGroupMock() {
  const group = new Group();
  group.id = undefined;
  group.groupName = faker.internet.userName();
  group.teacher = generateTeacherMock(false, true);
  group.tabUsers = generateRandomStudentTeacherMockList(10, false, true);
  return group;
}
