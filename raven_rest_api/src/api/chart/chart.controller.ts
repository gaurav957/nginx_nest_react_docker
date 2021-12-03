import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TOKEN_NAME } from 'src/constant/variable.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import ApiResponse from '../shared/dto/api-response.dto';
import { ChartService } from './chart.service';
import { CreateChartDto } from './dto/create-chart.dto';

@Controller('/v1/chart')
@ApiTags('Chart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(TOKEN_NAME)
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post()
  async createChart(@Body() createChartDto: CreateChartDto) {
    const response = await this.chartService.generateChart(createChartDto);
    return new ApiResponse(true, response, 'Chart generated');
  }
}
