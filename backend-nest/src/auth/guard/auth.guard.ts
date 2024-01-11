import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { BlacklistService } from '../service/blacklist.service';
import { IS_HEADERLESS_KEY } from '../../decorators/headerless.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    private readonly blacklistService: BlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //check public decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const isHeaderless = this.reflector.getAllAndOverride<boolean>(
      IS_HEADERLESS_KEY,
      [context.getHandler(), context.getClass()],
    );
    let token: string;
    const request = context.switchToHttp().getRequest();
    if (isHeaderless) {
      token = request.query.token;
    } else token = this.extractTokenFromHeader(request);

    if (!token || this.blacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
      request.user = await this.userService.getUser(payload.id);
      if (request.user.deleted) return false;
    } catch {
      throw new UnauthorizedException();
    }

    //check roles decorator
    const user = request.user;
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      if (user.getUserType() === UserType.NOT_CHOOSE)
        throw new UnauthorizedException();
      return true;
    }
    const authorised = this.matchRoles(roles, user.getUserType());
    if (!authorised) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  matchRoles(roles: UserType[], role: UserType) {
    return roles.includes(role);
  }
}
