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
            email: LOGIN_STRINGS.EMAIL,
            password: LOGIN_STRINGS.PASSWORD,
            submit: LOGIN_STRINGS.SUBMIT,
            missingEmail: LOGIN_STRINGS.EMAIL_MISSING,
            missingPassword: LOGIN_STRINGS.PASSWORD_MISSING,
            registerButton: LOGIN_STRINGS.REGISTER_BUTTON,
            registerRoute: LOGIN_STRINGS.REGISTER_ROUTE
        };
    },

    events: {
        'click #login-submit': 'login',
        'click #login-register': 'register'
    },

    login: function (ev) {
        ev.preventDefault();

        let user = new loginModel({
            password: this.$el.find('#login-password').val(),
            email: this.$el.find('#login-email').val()
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

        let login = new loginModel(attr);
        login.save({ attr }, {
            async: asyncBool,
            success: function (login) {
                // While there is nothing to redirect too just confirm success
                let selector = that.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`);
                selector.removeAttr('hidden');
                selector.text(`Sign in successful. Welcome ${login.attributes.email}`);
                // Backbone.history.navigate('homepage'); // TODO - why does FE app have this?
                // channel.trigger('nav:homepage');
            },
            error: function (ignore, response) {
                let selector = that.$el.find(`label[${LOGIN_STRINGS.DATA_TAG_PREFIX}-error]`);
                selector.removeAttr('hidden');
                if (response.status !== 401) {
                    let errorMessage = `StatusCode: ${response.status}, Text: ${response.statusText}`;
                    selector.text(errorMessage);
                }
            }
        });
    },
    register: function (ev) {
        ev.preventDefault();
        channel.trigger('nav:register');
    }
});
