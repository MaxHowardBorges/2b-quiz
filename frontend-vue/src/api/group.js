export async function createGroup(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/group/createGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}