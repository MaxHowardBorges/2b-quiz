import Papa from 'papaparse';
import { listEquals } from '@/utils/compareList';
import { ParseError } from '@/utils/parseError';
import { validateUserRole } from '@/utils/userRoles';

const csvHeader = ['username', 'name', 'surname', 'userType'];
export async function parseUserListCsv(csv) {
  let parsed = await parseFile(csv);
  if (!listEquals(parsed.meta.fields, csvHeader))
    throw new ParseError('Invalid CSV header');
  if (validateUserList(parsed.data)) throw new ParseError('Invalid CSV data');
  return parsed.data;
}

function parseFile(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
    });
  });
}

export function validateUserList(userList) {
  return userList.some(
    (user) =>
      !(
        user.username &&
        user.name &&
        user.surname &&
        validateUserRole(user.userType)
      ),
  );
}
