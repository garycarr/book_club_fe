'use strict';

import { Model } from 'backbone';
import loginRegisterMixin from './mixins/login-register';
import { LOGIN_STRINGS } from '../common/strings';

/**
 * Model for add context member
 * @module consumer/models/context_member
 */
export default Model.extend({
    defaults: {
        username: '',
        password: ''
    },
    url: function () {
        let url = `api/${LOGIN_STRINGS.URL}`;
        return loginRegisterMixin.url(url, this.id);
    },
    validate: function (attrs) {
        return loginRegisterMixin.validate(attrs);
    },
    // Probably a better way to do this, leaving in as a demo of how to override
    save: function (attrs, options) {
        loginRegisterMixin.save(attrs, options, this);
    }
});
