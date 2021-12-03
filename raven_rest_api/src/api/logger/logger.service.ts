import { Inject, Injectable } from '@nestjs/common';

import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { logMessages } from 'src/constant/message.constant';
import { Logger } from 'winston';
@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async logMessageGen(message: string, origin?: number, req?) {
    let Origin: string;
    if (origin == 1) {
      Origin = logMessages.ORIGIN_WEB;
    } else {
      Origin = logMessages.ORIGIN_SERVER;
    }
    const timeStamp = new Date();
    if (req.ip != undefined) {
      const Ip = req.ip;
      const userAgent = req.headers['user-agent'];
      const apiInfo = req.context.config;

      const logMessage = {
        message,
        Origin,
        timeStamp,
        Ip,
        userAgent,
        ...apiInfo,
      };
      return logMessage;
    } else {
      const logMessage = {
        message,
        Origin,
        timeStamp,
        reqDetails: logMessages.COULD_NOT_FETCH_REQUET,
      };
      return logMessage;
    }
  }
  async logError(message: string, origin?: number, req?: object) {
    const logMessage = await this.logMessageGen(message, origin, req);
    this.logger.log('error', logMessage);
  }

  async logWarn(message: string, origin?: number, req?: object) {
    const logMessage = await this.logMessageGen(message, origin, req);
    this.logger.log('warn', logMessage);
  }

  async logInfo(message: string) {
    this.logger.log('info', message);
  }
}
