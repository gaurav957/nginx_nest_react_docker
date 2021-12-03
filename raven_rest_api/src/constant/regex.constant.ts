const regex = {
  EMAIL_REGEX:
    /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){1,}@([\w\-]+)((\.[a-zA-Z0-9_-]{2,})+)$/,
  PHONENO_REGEX: /^([+]\d{2})?\d{10}$/,

  //min 8 char (upper,lower,specail,number) -required
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#&%$*])[A-Za-z\d!@#&%$*]{8,}$/,
};
export default regex;
