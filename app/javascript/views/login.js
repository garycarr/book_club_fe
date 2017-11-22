import mn from 'backbone.marionette';
import loginModel from '../models/login';
import template from '../templates/partials/login-register.hbs';
import loginRegisterMixin from './mixins/login-register';
import Radio from 'backbone.radio';
// import Backbone from 'backbone';

import { LOGIN_STRINGS } from '../common/strings';

const channel = Radio.channel('application');

export default mn.View.extend({
    tagName: 'div',

    template,

    templateContext: function () {
        return {
            id: LOGIN_STRINGS.ID,
            dataTagPrefix: LOGIN_STRINGS.DATA_TAG_PREFIX,
            submitError: LOGIN_STRINGS.LOGIN_ERROR,
            username: LOGIN_STRINGS.USERNAME,
            password: LOGIN_STRINGS.PASSWORD,
            submit: LOGIN_STRINGS.SUBMIT,
            missingUsername: LOGIN_STRINGS.USERNAME_MISSING,
            missingPassword: LOGIN_STRINGS.PASSWORD_MISSING,
            registerRoute: LOGIN_STRINGS.REGISTER_ROUTE
        };
    },

    events: {
        'click #login-submit': 'login'
    },

    login: function (ev) {
        ev.preventDefault();

        let user = new loginModel({
            password: this.$el.find('#login-password').val(),
            username: this.$el.find('#login-username').val()
        });
        // The wrong way to validate and clear messages
        let validationErrors = user.validate(user.attributes);

        // Remove any previous error messages
        loginRegisterMixin.removeErrorMessages(this.$el, LOGIN_STRINGS.DATA_TAG_PREFIX, user.attributes);

        if (validationErrors) {
            loginRegisterMixin.showErrorMessages(this.$el, LOGIN_STRINGS.DATA_TAG_PREFIX, validationErrors);
            return;
        }

        this.postLogin(user.attributes);
    },

    postLogin: function (attr, asyncBool) {
        let that = this;
        // Use a promise?
        if (asyncBool === undefined) {
            asyncBool = true;
        }

        let user = new loginModel(attr);
        user.save({ attr }, {
            async: asyncBool,
            success: function () {
                // Backbone.history.navigate('homepage'); // TODO - why does FE app have this?
                channel.trigger('nav:homepage');
            },
            error: function (ignore, response) {
                let selector = that.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`);
                selector.removeAttr('hidden');
                if (response.status !== 400) {
                    let errorMessage = `StatusCode: ${response.status}, Text: ${response.statusText}`;
                    selector.text(errorMessage);
                }
            }
        });
    }
});
