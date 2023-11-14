export async function createQuestionnary(body) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/create',
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function addQuestion(body,id) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/'+id+'/add-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getQuestionnary(id) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/'+id+'/select/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}