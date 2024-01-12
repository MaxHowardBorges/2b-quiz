export async function joinSession(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getCurrentQuestion(body) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/question/current',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
}

export async function sendAnswer(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function createSession(body) {
  console.log(body);
  return await fetch(import.meta.env.VITE_API_URL + '/session/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getNextQuestion(body) {
  return await fetch(import.meta.env.VITE_API_URL + '/session/nextQuestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getSessionResults(idSession) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/endSession?idsession=' + idSession,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
