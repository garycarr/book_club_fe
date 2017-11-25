import { USER_CONSTANTS } from '../../common/constants';
import { ENV_CONSTANTS } from '../../common/constants';
import { REGISTER_STRINGS } from '../../common/strings';
import { Model } from 'backbone';

export default {
    validate: function (attrs) {
        let errors = [];

        // Need to validate it is an email
        if (attrs.email.length < USER_CONSTANTS.EMAIL_MIN || attrs.email.length > USER_CONSTANTS.EMAIL_MAX) {
            errors.push({ name: 'email', message: REGISTER_STRINGS.EMAIL_MISSING });
        }
        if (attrs.password.length < USER_CONSTANTS.PASSWORD_MIN || attrs.password.length > USER_CONSTANTS.PASSWORD_MAX) {
            errors.push({ name: 'password', message: REGISTER_STRINGS.PASSWORD_MISSING });
        }
        return errors.length > 0 ? errors : false;
    },

    save: function (attrs, options, model) {
        model.set('email', model.get('email').toLowerCase());
        attrs.attr.email = attrs.attr.email.toLowerCase();
        Model.prototype.save.call(model, attrs, options);
    },

    url: function (urlString, id) {
        if (id) {
            urlString += `/${id}`;
        }
        // return urlString;
        // TODO: hack for bundle, remove this for dev.
        // There should be a rewrite rule for this
        let hostname = ENV_CONSTANTS.API_HOSTNAME;

        let pathStrippedApi = urlString.replace('api', '');
        let hackedURL = `${hostname}${pathStrippedApi}`;
        return hackedURL;
    }

};
