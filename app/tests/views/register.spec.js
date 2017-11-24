import RegisterView from '../../javascript/views/register';
import { ENV_CONSTANTS } from '../../javascript/common/constants';
import { REGISTER_STRINGS } from '../../javascript/common/strings';
import { REGISTER_CONSTANTS } from '../../javascript/common/constants';
import { USER_CONSTANTS } from '../../javascript/common/constants';
import Commmon from '../common';
import $ from 'jquery';

describe('Register view test', function () {

    beforeEach(function () {
        this.server = sinon.fakeServer.create({
            useFakeServer: true
        });
    });

    afterEach(function () {
        this.server.restore();
    });


    it('should fail validation for register', function () {
        let registerView = new RegisterView();
        registerView.render();
        let spyPostRegister = sinon.spy(registerView, 'postRegister');
        // Initially the error messages should be hidden
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-display-name]`).attr('hidden')).toBe('hidden');

        registerView.$el.find('#register-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));
        registerView.$el.find('#register-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));
        registerView.$el.find('#register-display-name').val(Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN - 1)); // full name too short
        registerView.$el.find('#register-submit').click();

        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-display-name]`).attr('hidden')).toBe(undefined);

        // registerView.$el.find('#register-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));
        // registerView.$el.find('#register-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN - 1));
        // registerView.$el.find('#register-display-name').val(Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN - 1)); // full name too short
        // registerView.$el.find('#register-submit').click();
        //
        // expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe('hidden');
        // expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe(undefined);
        // expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-display-name]`).attr('hidden')).toBe(undefined);
        //

        expect(spyPostRegister.calledOnce).toBe(false);
    });

    it('should pass validation for register and make a request', function () {
        let displayName = 'John Smith',
            email = 'john@example.com',
            password = 'abcdef',
            registerView = new RegisterView();

        registerView.render();

        let stub = sinon.spy(registerView, 'postRegister');
        registerView.$el.find('#register-email').val(email);
        registerView.$el.find('#register-password').val(password);
        registerView.$el.find('#register-display-name').val(displayName);
        registerView.$el.find('#register-submit').click();
        stub.restore();
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, { email:email, password:password, displayName:displayName });
    });

    it('should successfully register', function () {
        let displayName = 'John Smith',
            id = '12b',
            lowerCaseEmail = 'john@example.com',
            password = 'abcdef',
            registerView = new RegisterView(),
            upperCaseEmail = 'John@example.com';

        this.server.respondWith('POST', REGISTER_CONSTANTS.PATH,
            [200, { 'Content-Type': 'application/json' },
                `{ "id": "${id}" }`]);

        registerView.render();

        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ email: upperCaseEmail, password: password, displayName: displayName }, false);

        expect(ajaxSpy.calledOnce).toBe(true);
        expect(ajaxSpy.getCall(0).args[0].type).toBe('POST');
        expect(ajaxSpy.getCall(0).args[0].contentType).toBe('application/json');
        expect(ajaxSpy.getCall(0).args[0].dataType).toBe('json');

        // expect(ajaxSpy.getCall(0).args[0].url).toBe(REGISTER_CONSTANTS.PATH);
        // Ugly while were hacking in the env
        let hackedURL = `${ENV_CONSTANTS.API_HOSTNAME}/${REGISTER_CONSTANTS.PATH}`;
        hackedURL = hackedURL.replace('/api', '');
        expect(ajaxSpy.getCall(0).args[0].url).toBe(hackedURL);

        let data = JSON.parse(ajaxSpy.getCall(0).args[0].data);
        expect(data.email).toBe(lowerCaseEmail);
        expect(data.password).toBe(password);
        ajaxSpy.restore();
        // TODO - actions after register
    });

    it('should fail to register and display an error', function () {
        let displayName = 'John Smith',
            email = 'john@example.com',
            password = 'wrong pass',
            registerView = new RegisterView();

        this.server.respondWith('POST', REGISTER_CONSTANTS.PATH,
            [404, { 'Content-Type': 'application/json' },
                '']);

        registerView.render();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ email: email, password: password, displayName: displayName }, false);

        expect(ajaxSpy.calledOnce).toBe(true);

        // Check register error shows
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);

        ajaxSpy.restore();
    });

    it('should fail to register, then clear the error register error when an incorrect email is input', function () {
        let displayName = 'John Smith',
            email = 'john@example.com',
            password = 'wrong pass',
            registerView = new RegisterView();

        this.server.respondWith('POST', REGISTER_CONSTANTS.PATH,
            [404, { 'Content-Type': 'application/json' },
                '']);

        registerView.render();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ email: email, password: password, displayName: displayName }, false);

        expect(ajaxSpy.calledOnce).toBe(true);

        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);
        ajaxSpy.restore();

        // Now put in an incorrect email.  The register error should disappear
        registerView.$el.find('#register-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN - 1)); // email too short
        registerView.$el.find('#register-display-name').val(Commmon.generateString(USER_CONSTANTS.DISPLAY_NAME_MIN));
        registerView.$el.find('#register-submit').click();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe(undefined);
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-display-name]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
    });
});
