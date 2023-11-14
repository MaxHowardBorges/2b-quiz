import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtModuleOptions(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    global: true,
    secret: configService.getOrThrow('JWT_SECRET'),
    signOptions: {
      expiresIn:
        configService.getOrThrow('APP_ENV') == 'production' ? '1000s' : '3000s',
    },
  };
}
