import { USER_CONSTANTS } from '../../common/constants';
import { REGISTER_STRINGS } from '../../common/strings';
import { Model } from 'backbone';

export default {
    validate: function (attrs) {
        let errors = [];

        if (attrs.username.length < USER_CONSTANTS.USERNAME_MIN || attrs.username.length > USER_CONSTANTS.USERNAME_MAX) {
            errors.push({ name: 'username', message: REGISTER_STRINGS.USERNAME_MISSING });
        }
        if (attrs.password.length < USER_CONSTANTS.PASSWORD_MIN || attrs.password.length > USER_CONSTANTS.PASSWORD_MAX) {
            errors.push({ name: 'password', message: REGISTER_STRINGS.PASSWORD_MISSING });
        }
        return errors.length > 0 ? errors : false;
    },

    save: function (attrs, options, model) {
        model.set('username', model.get('username').toLowerCase());
        attrs.attr.username = attrs.attr.username.toLowerCase();
        Model.prototype.save.call(model, attrs, options);
    },

    url: function (urlString, id) {
        if (id) {
            urlString += id;
        }
        return urlString;
    }

};
