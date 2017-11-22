import { LOGIN_CONSTANTS } from '../../javascript/common/constants';

describe('constants tests', function () {
    it('token constants tests', function () {
        expect(LOGIN_CONSTANTS.PASSWORD_MIN).toBe(2);
    });
});
