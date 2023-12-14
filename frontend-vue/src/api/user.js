export async function registerUser(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

export async function getAllUsers(page, nbItem, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/user?page=${page}&nb-item=${nbItem}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getAllUsersSort(page, nbItem, sort, token) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      `/user?page=${page}&nb-item=${nbItem}&sort[field]=${sort.field}&sort[order]=${sort.order}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
