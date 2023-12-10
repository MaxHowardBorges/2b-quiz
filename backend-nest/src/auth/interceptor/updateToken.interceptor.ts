import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { BlacklistService } from '../service/blacklist.service';
import { UserRequest } from '../config/user.request';

@Injectable()
export class UpdateTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return next.handle();
    }
    return next.handle().pipe(
      map(async (body) => {
        const request = context.switchToHttp().getRequest<UserRequest>();
        const response = context.switchToHttp().getResponse();
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const oldToken = request.headers.authorization.split(' ')[1];
          const newToken = await this.authService.renewToken(request.user);
          response.setHeader('Access-Control-Expose-Headers', 'Authorization');
          response.setHeader('Authorization', `Bearer ${newToken}`);
          if (newToken !== oldToken) {
            this.blacklistService.addToBlacklist(oldToken);
          }
        }
        return body;
      }),
    );
  }
}
