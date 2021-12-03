import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter =
  (extensions: Array<string>) =>
  (req: Request, file: Express.Multer.File, callback) => {
    const fileExtensionArr = file.originalname.split('.');
    let fileExtension = '';

    if (fileExtensionArr.length)
      fileExtension = fileExtensionArr[fileExtensionArr.length - 1];

    if (extensions.indexOf(fileExtension) < 0) {
      return callback(new BadRequestException('Invalid file format'), false);
    }
    callback(null, true);
  };
