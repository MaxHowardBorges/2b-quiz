import { User } from '../../src/user/entity/user.entity';
import { Teacher } from '../../src/user/entity/teacher.entity';
import { Student } from '../../src/user/entity/student.entity';
import { Admin } from '../../src/user/entity/admin.entity';
import { faker } from '@faker-js/faker/locale/fr';

export function generateTeacherMock(
  deleteUser: boolean = false,
  validate: boolean = true,
) {
  const username = faker.internet.userName();
  const user = new Teacher(username, validate);
  user.id = Math.floor(Math.random() * 10000);
  user.name = faker.person.firstName();
  user.surname = faker.person.lastName();
  user.deleted = deleteUser;
  user.questionnaries = [];
  user.createdGroups = [];
  user.joinedGroups = [];
  return user;
}

export function generateStudentMock(
  deleteUser: boolean = false,
  validate: boolean = true,
) {
  const username = faker.internet.userName();
  const user = new Student(username, validate);
  user.id = Math.floor(Math.random() * 10000);
  user.name = faker.person.firstName();
  user.surname = faker.person.lastName();
  user.deleted = deleteUser;
  return user;
}

export function generateAdminMock(
  deleteUser: boolean = false,
  validate: boolean = true,
) {
  const username = faker.internet.userName();
  const user = new Admin(username, validate);
  user.id = Math.floor(Math.random() * 10000);
  user.name = faker.person.firstName();
  user.surname = faker.person.lastName();
  user.deleted = deleteUser;
  return user;
}

export function generateRandomUserMockList(
  nb: number,
  deteleUser: boolean = false,
  validate: boolean = true,
) {
  const users: User[] = [];
  for (let i = 0; i < nb; i++) {
    let user = null;
    const random = Math.floor(Math.random() * 3);
    switch (random) {
      case 0:
        user = generateTeacherMock(deteleUser, validate);
        break;
      case 1:
        user = generateStudentMock(deteleUser, validate);
        break;
      case 2:
        user = generateAdminMock(deteleUser, validate);
        break;
    }
    users.push(user);
  }
  return users;
}
