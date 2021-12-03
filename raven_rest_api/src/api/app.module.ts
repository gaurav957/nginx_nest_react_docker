import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BaseDaoModule } from './shared/base-dao/base-dao.module';
import { ChartModule } from './chart/chart.module';
import { SurveyDataModule } from './survey-data/survey-data.module';
import { QuestionModule } from './question/question.module';
import { FiltersModule } from './filters/filters.module';
import { QuestionUtilModule } from './shared/question-util/question-util.module';
import { LoggerModule } from './logger/logger.module';
import envConfig from 'src/config/env.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadDataToDatabaseModule } from './upload-data-to-database/upload-data-to-database.module';
import { ThemeModule } from './theme/theme.module';

const staticAppPath = join(__dirname, '../../public/client');

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.mongoose.url, envConfig.mongoose.options),
    ServeStaticModule.forRoot({
      rootPath: staticAppPath,
      exclude: ['/api*'],
    }),
    AuthModule,
    UserModule,
    BaseDaoModule,
    ChartModule,
    SurveyDataModule,
    QuestionModule,
    FiltersModule,
    QuestionUtilModule,
    LoggerModule,
    UploadDataToDatabaseModule,
    ThemeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
