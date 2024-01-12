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

export async function getQuestionsFromUser(id) {
  // return questions from idAuthor
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/user/' + id + '/questions/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
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

export async function deleteQuestionnary(idQuestionnary) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + idQuestionnary,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function getTags(id) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/tag/user/' + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function createTag(tag) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tag),
  });
}

export async function UpdateTag(tag) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/tag/' + tag.id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    },
  );
}

export async function DeleteTag(id) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/tag/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
