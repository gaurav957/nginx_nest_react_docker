export const responseMessages = {
  NOT_FOUND: 'Not found',
  USER_CREATED: 'User created successfully',
  USER_MODIFIED: 'User modified successfully',
  USER_DELETED: 'User deleted successfully',
  USER_FETCHED: 'User fetched successfully',
  USERS_FETCHED: 'Users fetched successfully',
  USER_ACTIVATED: 'User activated successfully',
  USER_DEACTIVATED: 'User de-activated successfully',
  USER_UPGRADE: 'Upgraded to admin rights',
  USER_DOWNGRADE: 'Downgraded to user rights',
  USER_AUTHENTICATED: 'User authenticated successfully',
  USER_LOGOUT: 'User logged out successfully',
  USER_PASSWORD_SAME: 'User password needs to be different',
  USER_PASSWORD_UPDATED: 'User password updated',
  PERMISSION_DENIED: 'Permission denied',
  EMAIL_EXISTS: 'User email aready exists',
  SEND_EMAIL: 'If user exists then email is sent to registered email',
  SUCCESS: 'Success',
  EMAIL_UNIQUE: 'User email is unique',
  EMAIL_NOT_UNIQUE: 'User email is not unique',
  EMAIL_CANT_UPDATE: 'User email can not be updated once verified',
  EMAIL_SAME_CANT_SEND_EMAIL_VERFIFCATION:
    'User email is same as previous one, If you are trying to resend email verification then please contact respective admin',
  ALREADY_ACTIVATED: 'The user is already activated',
  ALREADY_DEACTIVATED: 'The user is already deactivated',
  ALREADY_ADMIN: 'The user is already an admin',
  ALREADY_NOT_ADMIN: 'The user is already not an admin',
  PASSWORD_CHANGE: 'User password changed successfully',
  QUESTION_FETCHED: 'Questions fetched successfully',
  QUESTION_ADDED: 'Questions added successfully',
  WEB_APP_READY: 'Web app data successfully uploaded to database',
};
export const swaggerMessages = {
  TITLE: 'RAVEN REST API',
  DESCRIPTION: 'RAVEN project description will go here',
};

export const responseErrors = {
  SERVER_ERROR: 'Something went wrong',
  SESSION_EXPIRED: 'Your session is expired, Please login again',
  ERROR_OCCURED: 'An error occured, Please try again later',
  INVALID_BODY: 'Invalid request body',
  INVALID_CREDENTIALS: 'User credentials did not match',
  USER_NOT_ACTIVATED: 'User account is not activated yet',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  PASSWORD_REQUIRED: 'password is required',
  OLD_PASSWORD_REQUIRED: 'Old password is required',
  NEW_PASSWORD_REQUIRED: 'New password is required',
  PASSWORD_INVALID: 'password is invalid',
  OLD_PASSWORD_INVALID: 'Old password is invalid',
  NEW_PASSWORD_INVALID: 'New password is invalid',
  CONTENT_PAGE_CHECK_REQUIRED:
    'You need to answer this question to proceed further',
  TOKEN_REQUIRED: 'token is required',
  FIRST_NAME_REQUIRED: 'First Name is required',
  LAST_NAME_REQUIRED: 'Last Name is required',
  INVALID_TOKEN: 'Invalid token, please try again with a valid token',
  PASSWORD_ALREADY_SET: 'Password is already set for this user',
  FIRST_TIME_PASSWORD_NOTSET:
    'First time password not set, Please contact respective admin',
  USER_DEACTIVATED: 'User is deactivated, Please contact respective admin',
  EMAIL_CONFIRMATION_NOT_SENT:
    'User created but email confirmation not send, Please contact respective admin',
  MAIL_SERVER_ERROR: 'mail server error, Please try again later',
  EMAIL_CONFIRMED: 'Email is already confirmed for this user',
  USER_EDITED_BUT_MAIL_NOT_SEND:
    'User details modified successfully but email confirmation not send, Please contact respective admin',
  CAN_NOT_DEACTIVATE_IF_PENDING:
    'Can not deactivate until user confirms email verification',
  ACCOUNT_DISABLED: 'User account is disabled, Please contact respective admin',
  ACTIVATION_SUCC_MAIL_NOT_SEND:
    'User account activated but welcome mail not send',
  MAIL_NOT_SEND: 'Success but could not send mail',
  UNAUTHORISED: 'Unauthorised',
};

export const mailMessages = {
  ACTIVATION_SUCCESS_MAIL_SUBJECT:
    'Your account is activated now you can login into HFS',
  ACCOUNT_REACTIVATED_MAIL_SUBJECT: 'Your HFS account is Reactivated',
  ACCOUNT_DEACTIVATED_MAIL_SUBJECT: 'Your HFS account is Deactivated',
  PASSWORD_RESET_SUCC_MAIL_SUBJECT: 'Your HFS account password has been reset',
};

export const envErrors = {
  NODE_ENV_INVALID: 'The environment is not valid',
  NODE_ENV_REQUIRED: 'The environment must be set',
  MONGODB_URL_REQUIRED: "Couldn't find mongodb url",
  MONGODB_URL_PASSWORD: "Couldn't find mongodb password",
  MAIL_HOST_REQUIRED: "Couldn't find mail host",
  MAIL_AUTH_USER_REQUIRED: "Couldn't find mail auth user",
  MAIL_AUTH_PASSWORD_REQUIRED: "Couldn't find mail auth password",
  UI_BASE_URL_REQUIRED: "Couldn't find base ui url",
  REDIS_URL_REQUIRED: "Couldn't find redis url",
  REDIS_PORT_REQUIRED: "Couldn't find redis port",
  REDIS_TTL_REQUIRED: "Couldn't find time to live value",
};

export const logMessages = {
  LOGGED: 'Information logged successfully',
  ORIGIN_WEB: 'web',
  ORIGIN_SERVER: 'Server',
  LOG_MESSAGE_REQUIRED: 'Message is required to complete log operation',
  COULD_NOT_FETCH_REQUET: 'Could not find incoming request to log details',
};

export const themeMessages = {
  DEFAULT_THEME_SUCC: 'Default theme successfully updated',
  THEME_NOT_FOUND: 'Theme not found',
  THEME_UPDATED: 'Theme updated',
  THEME_SUCC: 'Theme successfully fetched',
};
