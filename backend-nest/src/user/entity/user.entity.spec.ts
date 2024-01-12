import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { Admin } from './admin.entity';
import * as typeorm from 'typeorm';
import {
  generateAdminMock,
  generateStudentMock,
  generateTeacherMock,
} from '../../../test/mock/user.mock';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

describe('UserEntities', () => {
  let teacher: Teacher;
  let teacher2: Teacher;
  let student: Student;
  let student2: Student;
  let admin: Admin;
  let admin2: Admin;

  beforeEach(() => {
    teacher = generateTeacherMock();
    teacher2 = generateTeacherMock();
    student = generateStudentMock();
    student2 = generateStudentMock();
    admin = generateAdminMock();
    admin2 = generateAdminMock();
  });

  it('should be defined', () => {
    expect(true).toBeTruthy();
  });

  it('should be equal', () => {
    expect(teacher.equals(teacher)).toBeTruthy();
    expect(teacher.equals(teacher2)).toBeFalsy();
    expect(student.equals(student)).toBeTruthy();
    expect(student.equals(student2)).toBeFalsy();
    expect(admin.equals(admin)).toBeTruthy();
    expect(admin.equals(admin2)).toBeFalsy();
  });

  // teacher
  describe('Teacher', () => {
    it('should be defined', () => {
      expect(teacher).toBeDefined();
    });
    //OneToMany decorator to be defined
    it('should have questionnaries', () => {
      const questionnary = new Questionnary();
      questionnary.author = teacher;
      teacher.questionnaries = [];
      teacher.questionnaries.push(questionnary);
      expect(teacher.questionnaries).toBeDefined();
      expect(teacher.questionnaries.length).toBe(1);
      expect(teacher.questionnaries[0]).toBe(questionnary);
      expect(teacher.questionnaries[0].author).toBe(teacher);
      expect(questionnary.author).toBe(teacher);
    });
  });
});
