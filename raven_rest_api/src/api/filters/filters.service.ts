import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as path from 'path';
import { IFilterTemplate } from 'src/types/template-data.interface';
import { readCsv } from 'src/utils/csv-reader.util';
import { CreateFilterDto } from './dto/create-filter.dto';
import { UpdateFilterDto } from './dto/update-filter.dto';
import { Filters, FiltersDocument } from './filters.schema';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Filters.name)
    private readonly filtersModel: Model<FiltersDocument>,
  ) {}

  async create() {
    const baseFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '/public/assets',
    );
    const filtersFilePath = baseFilePath + '/filterTemplate.csv';
    const filters = await readCsv<IFilterTemplate>(filtersFilePath);

    const filterDocuments: Filters[] = [];

    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index];

      filterDocuments.push({
        qId: filter.qId,
        selecttionType: filter.sType,
        order: +filter.order,
        labelText: filter.qLabelText,
        active: Boolean(+filter.active),
      });
    }
    await this.filtersModel.deleteMany();
    await this.filtersModel.insertMany(filterDocuments);
  }

  findAll() {
    return this.filtersModel.aggregate([
      {
        $lookup: {
          from: 'masterquestions',
          localField: 'qId',
          foreignField: 'qId',
          as: 'question',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$question', 0] }, '$$ROOT'],
          },
        },
      },
      { $unset: ['__v', 'question'] },
    ]);
  }
}
