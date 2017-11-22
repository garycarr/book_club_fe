import mn from 'backbone.marionette';
import userModel from '../models/users';
import template from '../templates/partials/login-register.hbs';
import loginRegisterMixin from './mixins/login-register';

import { REGISTER_STRINGS } from '../common/strings';


export default mn.View.extend({
    tagName: 'div',

    template,

    templateContext: function () {
        return {
            dataTagPrefix: REGISTER_STRINGS.DATA_TAG_PREFIX,
            id: REGISTER_STRINGS.ID,
            fullname: REGISTER_STRINGS.FULLNAME,
            username: REGISTER_STRINGS.USERNAME,
            password: REGISTER_STRINGS.PASSWORD,
            submit: REGISTER_STRINGS.SUBMIT,
            missingUsername: REGISTER_STRINGS.USERNAME_MISSING,
            missingFullname: REGISTER_STRINGS.FULLNAME_MISSING,
            missingPassword: REGISTER_STRINGS.PASSWORD_MISSING,
            submitError: REGISTER_STRINGS.REGISTER_ERROR,
            register: 1
        };
    },

    events: {
        'click #register-submit': 'register'
    },

    register: function (ev) {
        ev.preventDefault();
        let user = new userModel({
            password: this.$el.find('#register-password').val(),
            fullname: this.$el.find('#register-fullname').val(),
            username: this.$el.find('#register-username').val()
        });
        // The wrong way to validate and clear messages
        let validationErrors = user.validate(user.attributes);

        // Remove any previous error messages
        loginRegisterMixin.removeErrorMessages(this.$el, REGISTER_STRINGS.DATA_TAG_PREFIX, user.attributes);

        if (validationErrors) {
            loginRegisterMixin.showErrorMessages(this.$el, REGISTER_STRINGS.DATA_TAG_PREFIX, validationErrors);
            return;
        }
        this.postRegister(user.attributes);
    },

    postRegister: function (attr, asyncBool) {
        let that = this;
        // TODO - work out how to do this properly in testing
        if (asyncBool === undefined) {
            asyncBool = true;
        }

        let user = new userModel(attr);
        user.save({ attr }, {
            async: asyncBool,
            success: function () {
            },
            error: function () {
                that.$el.find(`label[${REGISTER_STRINGS.DATA_TAG_PREFIX}-error]`).removeAttr('hidden');
            }
        });
    }
});
