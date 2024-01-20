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

export async function getSessionResults(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/getMap?idsession=' + idSession,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getSessionStatus(token, idSession) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/status`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function setSessionSettings(token, idSession, body) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/settings`,
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

export async function addToWhitelist(token, idSession, body) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/whitelist/add`,
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
