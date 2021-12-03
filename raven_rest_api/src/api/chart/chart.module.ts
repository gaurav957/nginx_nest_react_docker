import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';
import { QuestionUtilModule } from '../shared/question-util/question-util.module';

@Module({
  imports: [QuestionUtilModule],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
