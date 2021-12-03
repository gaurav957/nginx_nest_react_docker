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

import { ThemeService } from './theme.service';
import { themeMessages } from 'src/constant/message.constant';
import { ThemeDto } from './dto/theme.dto';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import { themeValidation } from './validation/theme.validation';
import { TOKEN_NAME } from 'src/constant/variable.constant';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import Role from 'src/enums/role.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('theme')
@ApiTags('Dynamic Theme Setting')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiBearerAuth(TOKEN_NAME)
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get('/get-theme')
  // @Roles(Role.KEY_ADMIN)
  async getTheme() {
    const response = await this.themeService.getTheme();
    return new ApiResponse(true, response, themeMessages.THEME_SUCC);
  }

  @Patch('/update-theme')
  // @Roles(Role.KEY_ADMIN)
  async updateTheme(
    @Body(new JoiValidationPipe(themeValidation)) themeDto: ThemeDto,
  ) {
    const response = await this.themeService.updateTheme(themeDto);
    return new ApiResponse(true, response, themeMessages.THEME_UPDATED);
  }

  @Post('/set-default-theme')
  // @Roles(Role.KEY_ADMIN)
  async setDeafultTheme() {
    const response = await this.themeService.setDefaultTheme();
    return new ApiResponse(true, response, themeMessages.DEFAULT_THEME_SUCC);
  }
}
