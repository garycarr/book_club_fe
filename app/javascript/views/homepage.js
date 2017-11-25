import mn from 'backbone.marionette';
import template from '../templates/homepage.hbs';
import Radio from 'backbone.radio';
import { JWT_KEY } from '../common/constants';

import { HOMEPAGE_STRINGS } from '../common/strings';

const channel = Radio.channel('application');

export default mn.View.extend({
    tagName: 'div',

    template,

    templateContext: function () {
        return {
            id: HOMEPAGE_STRINGS.ID,
            logout: HOMEPAGE_STRINGS.LOGOUT,
            welcomeMessage: HOMEPAGE_STRINGS.WELCOME_MESSAGE
        };
    },

    events: {
        'click #homepage-logout': 'logout'
    },

    logout: function (ev) {
        ev.preventDefault();
        localStorage.removeItem(JWT_KEY);
        channel.trigger('nav:login');
    }
});
