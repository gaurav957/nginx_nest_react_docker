import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ApiResponse from '../shared/dto/api-response.dto';
import { UploadDataToDatabaseService } from './upload-data-to-database.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TOKEN_NAME } from 'src/constant/variable.constant';
import { responseMessages } from 'src/constant/message.constant';
import Role from 'src/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Setup web app')
@Controller('upload-data-to-database')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiBearerAuth(TOKEN_NAME)
export class UploadDataToDatabaseController {
  constructor(
    private readonly uploadDataToDatabaseService: UploadDataToDatabaseService,
  ) {}

  @Post()
  // @Roles(Role.KEY_ADMIN)
  async uploadData() {
    await this.uploadDataToDatabaseService.uploadData();
    return new ApiResponse(true, null, responseMessages.WEB_APP_READY);
  }
}
