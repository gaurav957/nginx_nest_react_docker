import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchmea } from './user.schema';
import { BaseDaoModule } from '../shared/base-dao/base-dao.module';
import { MailModule } from '../shared/mail/mail.module';
import { AppCacheModule } from '../shared/app-cache/app-cache.module';
import { CryptoModule } from '../shared/crypto/crypto/crypto.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AppCacheModule,
    CryptoModule,
    BaseDaoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchmea }]),
    MailModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
