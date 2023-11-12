import { User } from '../../user/entity/user.entity';
import { Request } from 'express';

export interface UserRequest extends Request {
  user: User;
}
