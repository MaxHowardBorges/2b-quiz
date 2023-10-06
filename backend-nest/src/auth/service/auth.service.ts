import { Injectable } from '@nestjs/common';
import { AuthConstants } from '../constants/auth.constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(AuthConstants.SALT_ROUNDS);

    return await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
