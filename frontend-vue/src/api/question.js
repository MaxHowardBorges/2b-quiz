export async function getQuestionFromId(id, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/question/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getQuestionsFromUser(token) {
  // return questions from idAuthor
  return await fetch(
    import.meta.env.VITE_API_URL + '/question/user/questions/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
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

//TODO error 401 Unauthorized
export async function getTags(token) {
  return await fetch(import.meta.env.VITE_API_URL + '/question/tag', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createTag(tag, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/question/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  });
}

export async function updateTag(tag, token) {
  console.log(tag);
  return await fetch(
    import.meta.env.VITE_API_URL + '/question/tag/' + tag.idTag,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    },
  );
}

export async function deleteTag(tag, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/question/tag/' + tag.idTag,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
