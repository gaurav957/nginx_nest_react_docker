import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { JwtModule } from '@nestjs/jwt';
import envConfig from 'src/config/env.config';

@Module({
  imports: [
    JwtModule.register({
      secret: envConfig.jwt.secret,
      signOptions: { expiresIn: envConfig.jwt.accessExpirationMinutes },
    }),
  ],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
