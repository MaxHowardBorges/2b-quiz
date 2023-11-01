export async function joinSession(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
