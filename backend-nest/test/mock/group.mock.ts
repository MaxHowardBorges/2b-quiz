import { faker } from '@faker-js/faker/locale/fr';
import { Group } from '../../src/user/entity/group.entity';
import { generateTeacherMock } from './user.mock';

export function generateGroupMock() {
  const group = new Group();
  group.id = faker.number.int();
  group.groupName = faker.internet.userName();
  group.teacher = generateTeacherMock(false, true);
  group.tabUsers = [];
  return group;
}
