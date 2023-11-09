import { User } from '../../user/entity/user.entity';

export interface UserRequest extends Request {
  user: User;
}
