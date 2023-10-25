import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtModuleOptions(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    global: true,
    secret: '14b9a297420ba5fe55b00c1b35380b754bbedb23f8e367df3bcc04d317ece958',
    signOptions: {
      expiresIn:
        configService.getOrThrow('APP_ENV') == 'production' ? '300s' : '3000s',
    },
  };
}
