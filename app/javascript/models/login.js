'use strict';

import { Model } from 'backbone';
import loginRegisterMixin from './mixins/login-register';
import { LOGIN_CONSTANTS } from '../common/constants';

/**
 * Model for add context member
 * @module consumer/models/context_member
 */
export default Model.extend({
    defaults: {
        email: '',
        password: ''
    },
    url: function () {
        return loginRegisterMixin.url(`${LOGIN_CONSTANTS.PATH}`, this.id);
    },
    validate: function (attrs) {
        return loginRegisterMixin.validate(attrs);
    },
    // Probably a better way to do this, leaving in as a demo of how to override
    save: function (attrs, options) {
        loginRegisterMixin.save(attrs, options, this);
    }
});
