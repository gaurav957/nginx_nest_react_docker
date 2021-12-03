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
import { FiltersService } from './filters.service';
import { CreateFilterDto } from './dto/create-filter.dto';
import { UpdateFilterDto } from './dto/update-filter.dto';
import ApiResponse from '../shared/dto/api-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TOKEN_NAME } from 'src/constant/variable.constant';

@ApiTags('Filter')
@Controller('v1/filters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(TOKEN_NAME)
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  async create(@Body() createFilterDto: CreateFilterDto) {
    await this.filtersService.create();
    return new ApiResponse(true, null, 'Filters added successfully');
  }

  @Get()
  async findAll() {
    const filters = await this.filtersService.findAll();
    return new ApiResponse(true, filters, 'Filters Fetched successfully');
  }
}
