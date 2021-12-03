import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { envErrors } from 'src/constant/message.constant';

const ENV = process.env.NODE_ENV || 'production';

dotenv.config({
  path: `./.${ENV}.env`,
});

const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development')
    .default('production')
    .messages({
      'string.valid': envErrors.NODE_ENV_INVALID,
      'string.required': envErrors.NODE_ENV_REQUIRED,
    }),
  PORT: Joi.number().default(5100),
  MONGODB_URL: Joi.string().required().messages({
    'string.required': envErrors.MONGODB_URL_REQUIRED,
  }),
  // MONGODB_PASSWORD: Joi.string()
  //   .when('NODE_ENV', {
  //     is: 'production',
  //     then: Joi.required(),
  //     otherwise: Joi.optional(),
  //   })
  //   .required()
  //   .description('Mongo DB password')
  //   .messages({
  //     'string.required': envErrors.MONGODB_URL_PASSWORD,
  //   }),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  // CLIENT_BUILD_PATH: Joi.string().required().description('Client build path'),
  BASE_URL: Joi.string().required().description('Base Url'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30000000000),

  MAIL_HOST: Joi.string().required().messages({
    'string.required': envErrors.MAIL_HOST_REQUIRED,
  }),
  MAIL_AUTH_USER: Joi.string().required().messages({
    'string.required': envErrors.MAIL_AUTH_USER_REQUIRED,
  }),
  MAIL_AUTH_PASS: Joi.string().required().messages({
    'string.required': envErrors.MAIL_AUTH_PASSWORD_REQUIRED,
  }),

  UI_BASE_URL: Joi.string().required().messages({
    'string.required': envErrors.UI_BASE_URL_REQUIRED,
  }),

  REDIS_URL: Joi.string().required().messages({
    'string.required': envErrors.REDIS_URL_REQUIRED,
  }),
  REDIS_PORT: Joi.string().required().messages({
    'string.required': envErrors.REDIS_PORT_REQUIRED,
  }),
  REDIS_TTL: Joi.string().required().messages({
    'string.required': envErrors.REDIS_TTL_REQUIRED,
  }),
}).unknown();

const { value: envVars, error } = envValidationSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const mongodbUrl = envVars.MONGODB_URL.replace(
  '<password>',
  envVars.MONGODB_PASSWORD,
);

const envConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
  // CLIENT_BUILD_PATH: envVars.CLIENT_BUILD_PATH,
  mongoose: {
    url: mongodbUrl,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // connectionName: 'buysquare',
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes: 10,
  },
  mailModule: {
    mailHost: envVars.MAIL_HOST,
    mailAuthUser: envVars.MAIL_AUTH_USER,
    mailAuthPass: envVars.MAIL_AUTH_PASS,
  },
  redis: {
    url: envVars.REDIS_URL,
    port: envVars.REDIS_PORT,
    ttl: envVars.REDIS_TTL,
  },

  uiUrl: {
    uiBaseUrl: envVars.UI_BASE_URL,
  },
};

export default envConfig;
