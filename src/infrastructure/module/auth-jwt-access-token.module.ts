import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessConfig } from '../../../config/configuration/configuration';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtAccessConfig>('jwtAccess');
        const options: JwtModuleOptions = {
          secret: jwtConfig.accessSecret,
          signOptions: {
            expiresIn: Number(jwtConfig.accessExpireTimeMinutes) * 60,
          },
        };
        return options;
      },
    }),
  ],
  providers: [
    {
      provide: 'AuthJwtAccessTokenService',
      useExisting: JwtService,
    },
  ],
  exports: ['AuthJwtAccessTokenService'],
})
export class AuthJwtAccessTokenModule {}
