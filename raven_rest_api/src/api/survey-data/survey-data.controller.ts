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
import { SurveyDataService } from './survey-data.service';
import { CreateSurveyDatumDto } from './dto/create-survey-datum.dto';
import { UpdateSurveyDatumDto } from './dto/update-survey-datum.dto';
import { ApiTags } from '@nestjs/swagger';
import ApiResponse from '../shared/dto/api-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TOKEN_NAME } from 'src/constant/variable.constant';
@Controller('survey-data')
@ApiTags('Survey Data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(TOKEN_NAME)
export class SurveyDataController {
  constructor(private readonly surveyDataService: SurveyDataService) {}

  @Post()
  async create(@Body() createSurveyDatumDto: CreateSurveyDatumDto) {
    await this.surveyDataService.create();
    return new ApiResponse(true, null, 'Survey data inserted successfully');
  }

  @Get()
  findAll() {
    return this.surveyDataService.findAll();
  }
}
