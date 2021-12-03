import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ApiResponse from '../shared/dto/api-response.dto';
import { responseMessages } from 'src/constant/message.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TOKEN_NAME } from 'src/constant/variable.constant';

@ApiTags('Question')
@Controller('v1/question')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(TOKEN_NAME)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async bulkInsertQuestions() {
    await this.questionService.bulkInsertQuestions();
    return new ApiResponse(true, null, responseMessages.QUESTION_ADDED);
  }

  @Post('/master')
  async bulkInsertMasterQuestions() {
    await this.questionService.bulkInsertMasterQuestions();
    return new ApiResponse(true, null, responseMessages.QUESTION_ADDED);
  }

  @Post('/banner')
  async bulkInsertBannerQuestions() {
    await this.questionService.bulkInsertBannerQuestions();
    return new ApiResponse(true, null, responseMessages.QUESTION_ADDED);
  }

  @Get()
  async findAll() {
    const questions = await this.questionService.findAllQuestions();
    return new ApiResponse(true, questions, responseMessages.QUESTION_FETCHED);
  }

  @Get('/master')
  async findAllMasterQuestions() {
    const questions = await this.questionService.findAllMasterQuestions();
    return new ApiResponse(true, questions, responseMessages.QUESTION_FETCHED);
  }

  @Get('/banner')
  async findAllBannerQuestions() {
    const questions = await this.questionService.findAllBannerQuestions();
    return new ApiResponse(true, questions, responseMessages.QUESTION_FETCHED);
  }
}
