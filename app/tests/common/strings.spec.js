import { HEADER_STRINGS } from '../../javascript/common/strings';

describe('strings tests', function () {
    it('token strings tests', function () {
        expect(HEADER_STRINGS.TITLE).toBe('Book Club!');
    });
});
