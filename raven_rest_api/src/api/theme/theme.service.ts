import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Theme, ThemeDocument } from './schema/theme.schema';
import {
  defaultChartTheme,
  defaultFeatures,
  defaultPrimaryTheme,
  defaultStaticText,
} from 'src/constant/theme.constant';
import { THEME_KEY } from 'src/constant/variable.constant';
import { responseErrors, themeMessages } from 'src/constant/message.constant';
@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(Theme.name)
    private readonly themeModel: Model<ThemeDocument>,
  ) {}

  async getTheme() {
    const result = await this.themeModel.findOne({ key: THEME_KEY });
    if (result == null) {
      throw new BadRequestException(themeMessages.THEME_NOT_FOUND);
    }
    return result;
  }

  async updateTheme(themeDto) {
    const result = await this.themeModel.findOneAndUpdate(
      {
        key: THEME_KEY,
      },
      { ...themeDto },
      { new: true },
    );
    if (result == null) {
      throw new BadRequestException(themeMessages.THEME_NOT_FOUND);
    }
    return result;
  }

  async setDefaultTheme() {
    await this.themeModel.deleteMany();
    const result = await this.themeModel.create({
      key: THEME_KEY,
      ...defaultChartTheme,
      ...defaultFeatures,
      ...defaultPrimaryTheme,
      ...defaultStaticText,
    });
    if (result == null) {
      throw new InternalServerErrorException(responseErrors.SERVER_ERROR);
    }
    return result;
  }
}
