export async function registerUser(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
