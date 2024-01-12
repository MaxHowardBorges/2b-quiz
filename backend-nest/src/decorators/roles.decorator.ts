import { Reflector } from '@nestjs/core';
import { UserType } from '../user/constants/userType.constant';

export const Roles = Reflector.createDecorator<UserType[]>();
