export const LOGIN_CONSTANTS = {
    PASSWORD_MAX: 80,
    PASSWORD_MIN: 2,
    PATH: 'api/login',
    EMAIL_MAX: 200,
    EMAIL_MIN: 3
};

export const USER_CONSTANTS = {
    DISPLAY_NAME_MAX: 500,
    DISPLAY_NAME_MIN: 2,
    PASSWORD_MAX: LOGIN_CONSTANTS.PASSWORD_MAX,
    PASSWORD_MIN: LOGIN_CONSTANTS.PASSWORD_MIN,
    PATH: 'api/user',
    EMAIL_MAX: LOGIN_CONSTANTS.EMAIL_MAX,
    EMAIL_MIN: LOGIN_CONSTANTS.EMAIL_MIN
};

export const REGISTER_CONSTANTS = {
    PATH: 'api/user'
};

export const JWT_KEY = 'book-jwt';

// TODO: Environment vars should not be constants
// but they will do for now
export const ENV_CONSTANTS = {
    // API_HOSTNAME: 'http://bookclubbackend-env.sa-east-1.elasticbeanstalk.com'
    API_HOSTNAME: 'http://localhost:8080'
};
