import { generateTeacherMock } from './user.mock';
import {
  generateAnswerMock,
  generateQuestionnaryMock,
} from './questionnary.mock';
import { SettingsObject } from '../../src/session/object/settings.object';
import { SessionTemp } from '../../src/session/temp/sessionTemp';
import { DisplaySettingsObject } from '../../src/session/object/displaySettings.object';
import { AccessTypeEnum } from '../../src/session/enum/accessType.enum';
import { Session } from '../../src/session/entity/session.entity';
import { UserSession } from '../../src/session/entity/userSession.entity';
import { ParticipantInterface } from '../../src/user/interface/participant.interface';
import { Student } from '../../src/user/entity/student.entity';
import { Teacher } from '../../src/user/entity/teacher.entity';

export function generateSessionMock(sessionTemp: SessionTemp): Session {
  const session = new Session();
  session.id = undefined;
  session.questionnary = sessionTemp.questionnary;
  session.teacher = sessionTemp.host;
  session.isResult = sessionTemp.settings.isResult;
  session.isGlobal = sessionTemp.settings.isGlobal;
  session.isResponses = sessionTemp.settings.isResponses;
  session.date = new Date();
  session.userSession = generateUserSessionListMock(sessionTemp);
  return session;
}

export function generateUserSessionListMock(sessionTemp: SessionTemp) {
  const userSessionList = [];
  for (const user of sessionTemp.connectedUser) {
    userSessionList.push(generateUserSessionMock(user, sessionTemp));
  }
  return userSessionList;
}

export function generateUserSessionMock(
  user: ParticipantInterface,
  sessionTemp: SessionTemp,
) {
  const userSession = new UserSession();
  userSession.id = undefined;
  if (user instanceof Student) {
    userSession.student = user;
  } else if (user instanceof Teacher) {
    userSession.teacher = user;
  }
  userSession.answer = generateAnswerListMock(sessionTemp);
  return userSession;
}

export function generateAnswerListMock(sessionTemp: SessionTemp) {
  const answerList = [];
  for (const question of sessionTemp.questionnary.questions) {
    answerList.push(question.answers[0]);
    question.answers[0].question = question;
  }
  return answerList;
}

export function generateSessionTempMock(
  accessType: AccessTypeEnum,
  participants: ParticipantInterface[] = [],
): SessionTemp {
  const teacher = generateTeacherMock(false, true);
  const sessionTemp = new SessionTemp(
    generateSessionId(),
    generateQuestionnaryMock(teacher),
    teacher,
    generateSettingsMock(accessType),
  );
  if (participants.length === 0) {
    for (const user of sessionTemp.connectedUser) {
      sessionTemp.connectedUser.add(user);
    }
  }
  sessionTemp.settings = generateSettingsMock(accessType);
  return sessionTemp;
}

export function generateSettingsMock(accessType: AccessTypeEnum) {
  return new SettingsObject(
    new DisplaySettingsObject(false, false),
    accessType,
    false,
    false,
    false,
  );
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(7);
}
