import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import envConfig from 'src/config/env.config';

import { AppCacheModule } from '../app-cache/app-cache.module';

@Module({
  imports: [
    AppCacheModule,

    MailerModule.forRoot({
      transport: {
        host: envConfig.mailModule.mailHost,
        secure: false,
        auth: {
          user: envConfig.mailModule.mailAuthUser,
          pass: envConfig.mailModule.mailAuthPass,
        },
      },
      defaults: {
        from: envConfig.mailModule.mailAuthUser,
      },
      template: {
        dir: join(__dirname, '..', '..', '..', '..', '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
