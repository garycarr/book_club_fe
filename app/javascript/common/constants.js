export const LOGIN_CONSTANTS = {
    PASSWORD_MAX: 80,
    PASSWORD_MIN: 2,
    PATH: 'api/login',
    USERNAME_MAX: 20,
    USERNAME_MIN: 2
};

export const USER_CONSTANTS = {
    FULLNAME_MAX: 500,
    FULLNAME_MIN: 2,
    PASSWORD_MAX: LOGIN_CONSTANTS.PASSWORD_MAX,
    PASSWORD_MIN: LOGIN_CONSTANTS.PASSWORD_MIN,
    PATH: 'api/users',
    USERNAME_MAX: LOGIN_CONSTANTS.USERNAME_MAX,
    USERNAME_MIN: LOGIN_CONSTANTS.USERNAME_MIN
};

export const REGISTER_CONSTANTS = {
    PATH: 'api/users'
};

// TODO: Environment vars should not be constants
// but they will do for now
export const ENV_CONSTANTS = {
    API_HOSTNAME: 'http://elasticbeanstalk.com'
    // API_HOSTNAME: 'http://localhost:8080'
};
