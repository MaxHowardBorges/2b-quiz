import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BcryptConstants } from '../constants/bcrypt.constants';

@Injectable()
export class BcryptService {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(BcryptConstants.SALT_ROUNDS);

    return await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
