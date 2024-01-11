import { ParseError } from '@/utils/parseError';

export const UserRoles = {
  ADMIN: 'admin',
  NOT_CHOOSE: 'notChoose',
  STUDENT: 'student',
  TEACHER: 'teacher',
};

// return UserRoles without NOT_CHOOSE
export function getUserRoles() {
  return Object.values(UserRoles).filter(
    (role) => role !== UserRoles.NOT_CHOOSE,
  );
}

export function validateUserRole(userRole) {
  return getUserRoles().includes(userRole);
}
