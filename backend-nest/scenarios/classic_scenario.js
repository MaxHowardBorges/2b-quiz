const API_URL = 'http://localhost:3000';

async function createSession() {
  const response = await fetch(API_URL + '/session/create', {
    method: 'POST',
  });
  const content = await response.json();
  return content.id;
}

async function nextQuestion(idSession) {
  const body = { idSession };
  const response = await fetch(API_URL + '/session/nextQuestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const question = await response.json();
  return Object.entries(question).length !== 0;
}

async function getSessionResults(idSession) {
  return await fetch(API_URL + '/session/getMap?idsession=' + idSession, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getCurrentQuestion(idSession) {
  return await fetch(API_URL + '/session/question/current', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idSession }),
  });
}

async function sendAnswer(idSession, answer, username) {
  const body = {
    idSession,
    answer,
    username,
  };
  return await fetch(API_URL + '/session/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function joinSession(idSession, username) {
  const body = { idSession, username };
  return await fetch(API_URL + '/session/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function answer(idSession, nbStudent) {
  for (let i = 0; i < nbStudent; i++) {
    const question = await (await getCurrentQuestion(idSession)).json();
    await sendAnswer(idSession, question.answers[0].id, 'user' + i);
  }
}

module.exports = async function main(nbStudent) {
  let idSession = await createSession();
  for (let i = 0; i < nbStudent; i++) {
    await joinSession(idSession, 'user' + i);
  }
  let nextQ = await nextQuestion(idSession);
  while (!!nextQ) {
    await answer(idSession, nbStudent);
    nextQ = await nextQuestion(idSession);
  }
  await getSessionResults(idSession);
};
