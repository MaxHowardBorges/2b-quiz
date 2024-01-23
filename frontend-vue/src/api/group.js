export async function createGroup(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function getGroupsOfTeacher(token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/group',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getGroup(idGroup, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/' + idGroup, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteGroup(idGroup, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/' + idGroup, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function removeStudentFromGroup(idGroup, idStudent, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/' + idGroup + '/user/' + idStudent, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addStudentToGroup(idGroup, idStudent, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/' + idGroup + '/user/' + idStudent, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

