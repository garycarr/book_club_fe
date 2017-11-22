'use strict';

import { Model } from 'backbone';
import loginRegisterMixin from './mixins/login-register';
import { USER_CONSTANTS } from '../common/constants';
import { REGISTER_STRINGS } from '../common/strings';

/**
 * Model for add context member
 * @module consumer/models/context_member
 */
export default Model.extend({
    defaults: {
        username: '',
        password: '',
        fullname: ''
    },
    url: function () {
        return loginRegisterMixin.url(REGISTER_STRINGS.URL, this.id);
    },
    idAttribute: '_id',
    validate: function (attrs) {
        let errors = [];
        let validateResponse = loginRegisterMixin.validate(attrs);
        if (validateResponse !== false) {
            errors = validateResponse;
        }
        if (attrs.fullname.length < USER_CONSTANTS.FULLNAME_MIN || attrs.fullname.length > USER_CONSTANTS.FULLNAME_MAX) {
            errors.push({ name: 'fullname', message: REGISTER_STRINGS.NAME_MISSING });
        }
        return errors.length > 0 ? errors : false;

    },
    // Probably a better way to do this, leaving in as a demo of how to override
    save: function (attrs, options) {
        loginRegisterMixin.save(attrs, options, this);
    }
});
