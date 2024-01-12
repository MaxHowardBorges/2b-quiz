export async function createQuestionnary(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function addQuestion(body, id) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + id + '/question',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
}

export async function getQuestionnary(id) {
  // return questionnary without questions
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getQuestionnariesFromUser(id) {
  // return questionnaries without questions
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/user/' + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
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

export async function getQuestionsFromQuestionnary(id) {
  // return questions without answers
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + id + '/question/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function modifyQuestion(idQuestionnary, idQuestion, body) {
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
      },
      body: JSON.stringify(body),
    },
  );
}

export async function modifyQuestionnary(idQuestionnary, name) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/' + idQuestionnary,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionnaryName: name }),
    },
  );
}

export async function deleteQuestion(idQuestionnary, idQuestion) {
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

export async function getTags() {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/getTags', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function createTag(tag) {
  return await fetch(import.meta.env.VITE_API_URL + '/questionnary/createTag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tag),
  });
}
