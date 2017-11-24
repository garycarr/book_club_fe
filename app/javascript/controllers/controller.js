import Marionette from 'backbone.marionette';
import Radio      from 'backbone.radio';
import RegisterView from '../views/register';
import LoginView from '../views/login';
import HomepageView from '../views/homepage';

import { JWT_KEY } from '../common/constants';

/**
 * This controller implements the route methods.
 * @module application/controller/app_controller
 */
export default Marionette.Object.extend({
    /**
     * Method called on instantiation and consumes the options object.
     * @param {Object} options An object of initial values.
     */
    initialize (options) {
        this.layout = options.layout;
        const channel = Radio.channel('application');
        channel.on('nav:register', this.register.bind(this));
        channel.on('nav:login', this.login.bind(this));
        channel.on('nav:homepage', this.homepage.bind(this));
    },

    login () {
        this.layout.showChildView('content', new LoginView());
    },

    register () {
        this.layout.showChildView('content', new RegisterView());
    },

    homepage () {
        if (!localStorage.getItem(JWT_KEY)) {
            this.login();
            return;
        }
        this.layout.showChildView('content', new HomepageView());
    }
});
