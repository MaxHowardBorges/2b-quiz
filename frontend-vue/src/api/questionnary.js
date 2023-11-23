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

export async function getQuestionnaryFromUser(id) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/select/user/'+id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function modifyQuestion(idQuestionnary,idQuestion,body) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/'+idQuestionnary+'/modify-question/'+idQuestion,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
}

export async function deleteQuestion(idQuestionnary,idQuestion) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/questionnary/'+idQuestionnary+'/remove-question/'+idQuestion,
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
    import.meta.env.VITE_API_URL + '/questionnary/'+idQuestionnary,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}