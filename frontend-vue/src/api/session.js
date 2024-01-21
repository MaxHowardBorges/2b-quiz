export async function joinSession(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function getCurrentQuestion(body, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/question/current',
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

export async function sendAnswer(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function createSession(token, body) {
  console.log(body);
  return await fetch(import.meta.env.VITE_API_URL + '/session/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function getNextQuestion(body, token) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/nextQuestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function startEndingSession(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/endSession?idsession=' + idSession,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function stopSession(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL +
      '/session/stopSession?idsession=' +
      idSession,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getResults(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/getResults?idsession=' + idSession,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
