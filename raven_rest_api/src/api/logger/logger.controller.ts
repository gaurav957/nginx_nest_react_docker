import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { logMessages } from 'src/constant/message.constant';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import ApiResponse from '../shared/dto/api-response.dto';
import { LogErrorDto } from './dto/logError.dto';
import { LogWarnDto } from './dto/logWarn.dto';
import { LoggerService } from './logger.service';
import { LogErrorValidation } from './validation/logError.validation';

@ApiTags('Log')
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post('/logError')
  async logError(
    @Body(new JoiValidationPipe(LogErrorValidation))
    logErrorParams: LogErrorDto,
  ) {
    await this.loggerService.logError(
      logErrorParams.message,
      logErrorParams.origin,
      logErrorParams.req,
    );
    return new ApiResponse(true, null, logMessages.LOGGED);
  }
  @Post('/logWarn')
  async logWarn(
    @Body(new JoiValidationPipe(LogErrorValidation))
    logWarnParams: LogWarnDto,
  ) {
    await this.loggerService.logWarn(
      logWarnParams.message,
      logWarnParams.origin,
      logWarnParams.req,
    );
    return new ApiResponse(true, null, logMessages.LOGGED);
  }
  @Post('/logInfo')
  async logInfo(message: string) {
    this.loggerService.logInfo(message);
    return new ApiResponse(true, null, logMessages.LOGGED);
  }
}
