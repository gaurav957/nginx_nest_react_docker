import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Theme, ThemeSchema } from './schema/theme.schema';
import { AppCacheModule } from '../shared/app-cache/app-cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Theme.name, schema: ThemeSchema }]),
    AppCacheModule,
  ],
  controllers: [ThemeController],
  providers: [ThemeService],
  exports: [ThemeService],
})
export class ThemeModule {}
