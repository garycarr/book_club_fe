import RegisterView from '../../javascript/views/register';
import { REGISTER_STRINGS } from '../../javascript/common/strings';
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
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-username]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-fullname]`).attr('hidden')).toBe('hidden');

        registerView.$el.find('#register-username').val(Commmon.generateString(USER_CONSTANTS.USERNAME_MIN));
        registerView.$el.find('#register-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN));
        registerView.$el.find('#register-fullname').val(Commmon.generateString(USER_CONSTANTS.FULLNAME_MIN - 1)); // full name too short
        registerView.$el.find('#register-submit').click();

        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-username]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-fullname]`).attr('hidden')).toBe(undefined);

        registerView.$el.find('#register-username').val(Commmon.generateString(USER_CONSTANTS.USERNAME_MIN));
        registerView.$el.find('#register-password').val(Commmon.generateString(USER_CONSTANTS.PASSWORD_MIN - 1));
        registerView.$el.find('#register-fullname').val(Commmon.generateString(USER_CONSTANTS.FULLNAME_MIN - 1)); // full name too short
        registerView.$el.find('#register-submit').click();

        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-username]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-password]`).attr('hidden')).toBe(undefined);
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-fullname]`).attr('hidden')).toBe(undefined);


        expect(spyPostRegister.calledOnce).toBe(false);
    });

    it('should pass validation for register and make a request', function () {
        let fullname = 'John Smith',
            password = 'abcdef',
            registerView = new RegisterView(),
            username = 'john';

        registerView.render();

        let stub = sinon.spy(registerView, 'postRegister');
        registerView.$el.find('#register-username').val(username);
        registerView.$el.find('#register-password').val(password);
        registerView.$el.find('#register-fullname').val(fullname);
        registerView.$el.find('#register-submit').click();
        stub.restore();
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, { username:username, password:password, fullname:fullname });
    });

    it('should successfully register', function () {
        let fullname = 'John Smith',
            id = '12b',
            lowerCaseUsername = 'john',
            password = 'abcdef',
            registerView = new RegisterView(),
            upperCaseUsername = 'John';

        this.server.respondWith('POST', REGISTER_STRINGS.URL,
            [200, { 'Content-Type': 'application/json' },
                `{ "id": "${id}" }`]);

        registerView.render();

        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ username: upperCaseUsername, password: password, fullname: fullname }, false);

        expect(ajaxSpy.calledOnce).toBe(true);
        expect(ajaxSpy.getCall(0).args[0].type).toBe('POST');
        expect(ajaxSpy.getCall(0).args[0].contentType).toBe('application/json');
        expect(ajaxSpy.getCall(0).args[0].dataType).toBe('json');
        expect(ajaxSpy.getCall(0).args[0].url).toBe(REGISTER_STRINGS.PATH);
        let data = JSON.parse(ajaxSpy.getCall(0).args[0].data);
        expect(data.username).toBe(lowerCaseUsername);
        expect(data.password).toBe(password);
        ajaxSpy.restore();
        // TODO - actions after register
    });

    it('should fail to register and display an error', function () {
        let fullname = 'John Smith',
            password = 'wrong pass',
            registerView = new RegisterView(),
            username = 'john';

        this.server.respondWith('POST', REGISTER_STRINGS.URL,
            [404, { 'Content-Type': 'application/json' },
                '']);

        registerView.render();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ username: username, password: password, fullname: fullname }, false);

        expect(ajaxSpy.calledOnce).toBe(true);

        // Check register error shows
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);

        ajaxSpy.restore();
    });

    it('should fail to register, then clear the error register error when an incorrect username is input', function () {
        let fullname = 'John Smith',
            password = 'wrong pass',
            registerView = new RegisterView(),
            username = 'john';

        this.server.respondWith('POST', REGISTER_STRINGS.URL,
            [404, { 'Content-Type': 'application/json' },
                '']);

        registerView.render();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
        let ajaxSpy = sinon.spy($, 'ajax');
        registerView.postRegister({ username: username, password: password, fullname: fullname }, false);

        expect(ajaxSpy.calledOnce).toBe(true);

        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe(undefined);
        ajaxSpy.restore();

        // Now put in an incorrect username.  The register error should disappear
        registerView.$el.find('#register-username').val(Commmon.generateString(USER_CONSTANTS.USERNAME_MIN - 1)); // username too short
        registerView.$el.find('#register-fullname').val(Commmon.generateString(USER_CONSTANTS.FULLNAME_MIN));
        registerView.$el.find('#register-submit').click();
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-username]`).attr('hidden')).toBe(undefined);
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error-fullname]`).attr('hidden')).toBe('hidden');
        expect(registerView.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).attr('hidden')).toBe('hidden');
    });
});
