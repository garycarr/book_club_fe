'use strict';

import { Model } from 'backbone';
import loginRegisterMixin from './mixins/login-register';
import { USER_CONSTANTS } from '../common/constants';
import { REGISTER_CONSTANTS } from '../common/constants';
import { REGISTER_STRINGS } from '../common/strings';

/**
 * Model for add context member
 * @module consumer/models/context_member
 */
export default Model.extend({
    defaults: {
        email: '',
        password: '',
        displayName: ''
    },
    url: function () {
        return loginRegisterMixin.url(REGISTER_CONSTANTS.PATH, this.id);
    },
    idAttribute: '_id',
    validate: function (attrs) {
        let errors = [];
        let validateResponse = loginRegisterMixin.validate(attrs);
        if (validateResponse !== false) {
            errors = validateResponse;
        }
        if (attrs.displayName.length < USER_CONSTANTS.DISPLAY_NAME_MIN || attrs.displayName.length > USER_CONSTANTS.DISPLAY_NAME_MAX) {
            errors.push({ name: 'display-name', message: REGISTER_STRINGS.DISPLAY_NAME_MISSING });
        }
        return errors.length > 0 ? errors : false;

    },
    // Probably a better way to do this, leaving in as a demo of how to override
    save: function (attrs, options) {
        loginRegisterMixin.save(attrs, options, this);
    }
});
