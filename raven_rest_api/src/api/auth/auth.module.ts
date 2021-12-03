import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { User, UserSchmea } from '../user/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import envConfig from 'src/config/env.config';
import { MailModule } from '../shared/mail/mail.module';
import { AppCacheModule } from '../shared/app-cache/app-cache.module';
import { CryptoModule } from '../shared/crypto/crypto/crypto.module';

@Module({
  imports: [
    CryptoModule,
    AppCacheModule,

    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchmea }]),
    JwtModule.register({
      secret: envConfig.jwt.secret,
      signOptions: { expiresIn: envConfig.jwt.accessExpirationMinutes },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
