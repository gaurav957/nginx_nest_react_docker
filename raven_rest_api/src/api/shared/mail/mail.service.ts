import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async sendMail(
    templatePath: string,
    recipient: string,
    subject: string,
    context?: object,
  ) {
    try {
      await this.mailService.sendMail({
        to: recipient,
        subject,
        template: templatePath,
        context,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async mailGenerator(
    recipientMail: string,
    subject: string,
    templatePath: string,
    templateContext: object,
    cacheName: string,
    cacheExpTime: number,
    token: string,
  ) {
    await this.cacheManager.store.set(cacheName + '_' + recipientMail, token, {
      ttl: cacheExpTime,
    });

    try {
      await this.mailService.sendMail({
        to: recipientMail,
        subject: subject,
        template: templatePath,
        context: templateContext,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
