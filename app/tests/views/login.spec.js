import LoginView from '../../javascript/views/login';
import { ENV_CONSTANTS } from '../../javascript/common/constants';
import { LOGIN_CONSTANTS } from '../../javascript/common/constants';
import { USER_CONSTANTS } from '../../javascript/common/constants';
import { LOGIN_STRINGS } from '../../javascript/common/strings';

import Commmon from '../common';
import $ from 'jquery';

describe('Login view test', function () {

    beforeEach(function () {
        this.server = sinon.fakeServer.create({
            useFakeServer: true
        });
    });

    afterEach(function () {
        this.server.restore();
    });

    it('should find elements on page', function () {
        let loginView = new LoginView();
        loginView.render();
        expect(loginView.el.tagName.toLowerCase()).toBe('div');
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-email]`).text()).toBe(LOGIN_STRINGS.EMAIL);
        expect(loginView.$el.find(`#${LOGIN_STRINGS.ID}-password`).attr('type')).toBe('password');
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-password]`).text()).toBe(LOGIN_STRINGS.PASSWORD);
    });

    it('should fail validation for login', function () {
        let loginView = new LoginView();
        let spyLogin = sinon.spy(loginView, 'login');
        let spyPostLogin = sinon.spy(loginView, 'postLogin');
        loginView.render();
        // Initially the error messages should be hidden
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe('hidden');
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');

        loginView.$el.find('#login-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));
        loginView.$el.find('#login-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN - 1));
        loginView.$el.find('#login-submit').click();
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe('hidden');
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe(undefined);

        expect(spyPostLogin.calledOnce).toBe(false);
        expect(spyLogin.called).toBe(false); // TODO this should be true??? ev.preventDefault?

        loginView.$el.find('#login-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN - 1));
        loginView.$el.find('#login-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));
        loginView.$el.find('#login-submit').click();
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe(undefined);
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');
        expect(spyPostLogin.calledOnce).toBe(false);

        // Now make a valid request
        loginView.$el.find('#login-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN));
        loginView.$el.find('#login-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));
        loginView.$el.find('#login-submit').click();
        expect(spyPostLogin.calledOnce).toBe(true);
    });

    it('should pass validation for login and make a request', function () {
        let email = 'john@example.com',
            loginView = new LoginView(),
            password = 'abcdef';

        loginView.render();

        let postLoginSpy = sinon.spy(loginView, 'postLogin');

        loginView.$el.find('#login-email').val(email);
        loginView.$el.find('#login-password').val(password);
        loginView.$el.find('#login-submit').click();
        sinon.assert.calledOnce(postLoginSpy);
        sinon.assert.calledWith(postLoginSpy, { email:email, password:password });
        postLoginSpy.restore();
    });

    it('should successfully login', function () {
        let loginView = new LoginView(),
            lowerCaseEmail = 'john@example.com',
            password = 'abcdef',
            upperCaseEmail = 'John@example.com';

        this.server.respondWith('POST', LOGIN_STRINGS.URL,
            [200, { 'Content-Type': 'application/json' },
                '{ "token": "jsonwebtoken" }']);

        loginView.render();

        let localStorageSpy = sinon.spy(localStorage, 'setItem');
        let ajaxSpy = sinon.spy($, 'ajax');
        loginView.postLogin({ email: upperCaseEmail, password: password }, false);
        expect(this.server.requestedOnce).toBe(true);

        expect(ajaxSpy.calledOnce).toBe(true);
        expect(ajaxSpy.getCall(0).args[0].type).toBe('POST');
        expect(ajaxSpy.getCall(0).args[0].contentType).toBe('application/json');
        expect(ajaxSpy.getCall(0).args[0].dataType).toBe('json');
        // expect(ajaxSpy.getCall(0).args[0].url).toBe(LOGIN_CONSTANTS.PATH);
        // Ugly while were hacking in the env
        let hackedURL = `${ENV_CONSTANTS.API_HOSTNAME}/${LOGIN_CONSTANTS.PATH}`;
        hackedURL = hackedURL.replace('/api', '');
        expect(ajaxSpy.getCall(0).args[0].url).toBe(hackedURL);
        let data = JSON.parse(ajaxSpy.getCall(0).args[0].data);
        expect(data.email).toBe(lowerCaseEmail);
        expect(data.password).toBe(password);
        ajaxSpy.restore();

        expect(localStorageSpy.calledOnce).toBe(true);
        localStorageSpy.restore();
    });

    it('should fail to login and display an error', function () {
        let email = 'john@example.com',
            loginView = new LoginView(),
            password = 'wrong pass';

        this.server.respondWith('POST', LOGIN_STRINGS.URL,
            [401, { 'Content-Type': 'application/json' },
                '']);

        loginView.render();
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        loginView.postLogin({ email: email, password: password }, false);

        expect(ajaxSpy.calledOnce).toBe(true);
        expect(this.server.requestedOnce).toBe(true);

        // Check login error shows
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);

        ajaxSpy.restore();
    });

    it('should fail to login, then clear the error login error when an incorrect email is input', function () {
        let email = 'john@example.com',
            loginView = new LoginView(),
            password = 'wrong pass';

        this.server.respondWith('POST', LOGIN_STRINGS.URL,
            [401, { 'Content-Type': 'application/json' },
                '']);

        loginView.render();
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        loginView.postLogin({ email: email, password: password }, false);

        expect(ajaxSpy.calledOnce).toBe(true);
        expect(this.server.requestedOnce).toBe(true);

        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);
        ajaxSpy.restore();

        // Now put in an incorrect email.  The login error should disappear
        loginView.$el.find('#login-email').val(Commmon.generateString(USER_CONSTANTS.EMAIL_MIN - 1)); // email too short
        loginView.$el.find('#login-submit').click();
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error-email]`).attr('hidden')).toBe(undefined);
        expect(loginView.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
    });
});
