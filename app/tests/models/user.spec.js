import Users from '../../javascript/models/users';
import { USER_CONSTANTS } from '../../javascript/common/constants';
import { ENV_CONSTANTS } from '../../javascript/common/constants';
import Commmon from '../common';

describe('Users model test', function () {

    it('Create user model and validate input', function () {
        let user = new Users();
        expect(user.get('email')).toBe('');
        expect(user.get('password')).toBe('');
        expect(user.get('displayName')).toBe('');

        expect(user.isValid(true)).toBe(false);
        user.set('email', Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));

        // Still false without a password
        expect(user.isValid(true)).toBe(false);
        user.set('password', Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));

        // Now false with invalid full name
        expect(user.isValid(true)).toBe(false);
        user.set('displayName', Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN));

        // Now Okay
        expect(user.isValid(true)).toBe(true);

        // Test boundaries
        // Username
        user.set('email', Commmon.generateString(USER_CONSTANTS.EMAIL_MIN - 1));
        expect(user.isValid(true)).toBe(false);

        user.set('email', Commmon.generateString(USER_CONSTANTS.EMAIL_MAX + 1));
        expect(user.isValid(true)).toBe(false);

        user.set('email', Commmon.generateString(USER_CONSTANTS.EMAIL_MAX));
        expect(user.isValid(true)).toBe(true);

        // Password
        user.set('password', Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN - 1));
        expect(user.isValid(true)).toBe(false);

        user.set('password', Commmon.generateString(USER_CONSTANTS.PASSWORD_MAX + 1));
        expect(user.isValid(true)).toBe(false);

        // Full name
        // Password
        user.set('displayName', Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN - 1));
        expect(user.isValid(true)).toBe(false);

        user.set('displayName', Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MAX + 1));
        expect(user.isValid(true)).toBe(false);

        // Okay again
        user.set('email', Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));
        user.set('password', Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));
        user.set('displayName', Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN));
        expect(user.isValid(true)).toBe(true);
    });

    it('should test url', function () {
        let id = 'abc123',
            user = new Users();
        // expect(user.url()).toBe(USER_CONSTANTS.PATH);
        // Ugly while were hacking in the env
        let hackedURL = `${ENV_CONSTANTS.API_HOSTNAME}/${USER_CONSTANTS.PATH}`;
        hackedURL = hackedURL.replace('/api', '');
        expect(user.url()).toBe(hackedURL);
        user.set('id', id);
        // expect(`${user.url()}${id}`).toBe(`${USER_CONSTANTS.PATH}${id}`);
        // Ugly while were hacking in the env
        expect(`${user.url()}/${id}`).toBe(`${hackedURL}/${id}`);
    });

});
