export async function joinSession(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/join`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getCurrentQuestion(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/question`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

export async function getGlobalResults(idSession, token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/' + idSession + '/result/global',
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
    import.meta.env.VITE_API_URL + '/session/' + idSession + '/result',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getSessionList(token) {
  return await fetch(
    import.meta.env.VITE_API_URL + '/session/getSessionsList',
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

export async function getSessionDisplaySettings(token, idSession) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/display-settings`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getSessionResultSettings(token, idSession) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/result-settings`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function setSessionResultSettings(token, idSession, body) {
  return await fetch(
    import.meta.env.VITE_API_URL + `/session/${idSession}/result-settings`,
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
