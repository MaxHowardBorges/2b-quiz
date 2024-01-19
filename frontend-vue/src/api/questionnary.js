export async function createQuestionnary(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function addQuestion(body, id, token) {
  console.log(JSON.stringify(body));
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + id + '/question',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
}

export async function getQuestionnary(id, token) {
  // return questionnary without questions
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getQuestionnariesFromUser(token) {
  // return questionnaries without questions
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getQuestionsFromQuestionnary(id, token) {
  // return questions without answers
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + id + '/question/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function modifyQuestion(idQuestionnary, idQuestion, body, token) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      '/questionnary/' +
      idQuestionnary +
      '/question/' +
      idQuestion,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
}

export async function modifyQuestionnary(idQuestionnary, name, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + idQuestionnary,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionnaryName: name }),
    },
  );
}

export async function deleteQuestion(idQuestionnary, idQuestion, token) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      '/questionnary/' +
      idQuestionnary +
      '/question/' +
      idQuestion,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function deleteQuestionnary(idQuestionnary, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + idQuestionnary,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
