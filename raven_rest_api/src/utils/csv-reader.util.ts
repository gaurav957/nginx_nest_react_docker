import { Promise } from 'bluebird';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

export const readCsv = <T>(
  filePath: string,
  csvOptions?: csv.Options | readonly string[],
): Promise<Array<T>> => {
  return new Promise((resolve, reject) => {
    const result = [];
    createReadStream(filePath)
      .pipe(csv(csvOptions))
      .on('data', (data) => {
        result.push(data);
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
