import * as winston from 'winston';

const winstonConfigOptions: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
};

export default winstonConfigOptions;
