export async function registerUser(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function registerUserArray(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/register/multiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function loginUser(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function renewToken(token) {
  return await fetch(import.meta.env.VITE_API_URL + '/auth/renew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserType(token) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/role', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function validateSelf(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function getAllUsers(page, nbItem, token, deleted = false) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      `/user?page=${page}&nb-item=${nbItem}&deleted=${deleted}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getAllUsersSort(
  page,
  nbItem,
  sort,
  token,
  deleted = false,
) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      `/user?page=${page}&nb-item=${nbItem}&sort[field]=${sort.field}&sort[order]=${sort.order}&deleted=${deleted}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function validateUser(id, token) {
  return await fetch(import.meta.env.VITE_API_URL + `/user/${id}/validate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteUser(id, token) {
  return await fetch(import.meta.env.VITE_API_URL + `/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMe(token) {
  return await fetch(import.meta.env.VITE_API_URL + `/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateMe(token, body) {
  return await fetch(import.meta.env.VITE_API_URL + `/user/modify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function restoreUser(id, body, token) {
  return await fetch(import.meta.env.VITE_API_URL + `/user/${id}/restore`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}
