import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/*
 * This interceptor is used to return a 204 No Content response when the response body is empty.
 */
@Injectable()
export class NoContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // exclude EventController from this interceptor
    if (context.getClass().name === 'EventController') {
      return next.handle();
    }
    return next.handle().pipe(
      map(async (body) => {
        const response = context.switchToHttp().getResponse();
        if (response.statusCode >= 200 && response.statusCode < 300 && !body) {
          response.status(HttpStatus.NO_CONTENT);
        }
        return body;
      }),
    );
  }
}
