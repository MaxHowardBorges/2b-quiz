export async function getQuestionFromId(id) {
  return await fetch(import.meta.env.VITE_API_URL + '/question/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function getAnswersFromQuestion(id, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/question/' + id + '/select-answers/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
