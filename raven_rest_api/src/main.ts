import { NestFactory } from '@nestjs/core';
import fastifyCookie from 'fastify-cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './api/app.module';
import setupSwagger from './config/swagger.config';
import { WinstonModule } from 'nest-winston';
import * as morgan from 'morgan';
import winstonConfigOptions from './config/winston.config';
import envConfig from './config/env.config';
import GlobalExceptionFilter from './filters/exception.filter';
import { contentParser } from 'fastify-multer/lib';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert/cert.pem')),
  };
  // new FastifyAdapter(),
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter({ https: httpsOptions }),
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger(winstonConfigOptions),
    },
  );

  app.register(contentParser);
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });
  app.use(morgan('tiny'));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('/api');
  setupSwagger(app);

  const PORT = envConfig.port;
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
