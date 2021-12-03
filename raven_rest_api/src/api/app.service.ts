import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import envConfig from 'src/config/env.config';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
