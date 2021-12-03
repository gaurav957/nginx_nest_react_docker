import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Filters, FiltersSchema } from './filters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Filters.name, schema: FiltersSchema }]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService],
})
export class FiltersModule {}
