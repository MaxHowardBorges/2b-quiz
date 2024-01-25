import { generateTeacherMock } from './user.mock';
import { generateQuestionnaryMock } from './questionnary.mock';
import { SettingsObject } from '../../src/session/object/settings.object';
import { SessionTemp } from '../../src/session/temp/sessionTemp';
import { DisplaySettingsObject } from '../../src/session/object/displaySettings.object';
import { AccessTypeEnum } from '../../src/session/enum/accessType.enum';
import { Session } from '../../src/session/entity/session.entity';

export function generateSessionMock(sessionTemp: SessionTemp): Session {
  const session = new Session();
  session.id = undefined;
  session.questionnary = sessionTemp.questionnary;
  session.teacher = sessionTemp.host;
  session.isResult = sessionTemp.settings.isResult;
  session.isGlobal = sessionTemp.settings.isGlobal;
  session.isResponses = sessionTemp.settings.isResponses;
  session.date = new Date();
  return session;
}

export function generateSessionTempMock(
  accessType: AccessTypeEnum,
): SessionTemp {
  const teacher = generateTeacherMock(false, true);
  return new SessionTemp(
    generateSessionId(),
    generateQuestionnaryMock(teacher),
    teacher,
    generateSettingsMock(accessType),
  );
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
