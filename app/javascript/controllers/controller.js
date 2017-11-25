import Marionette from 'backbone.marionette';
import Radio      from 'backbone.radio';
import RegisterView from '../views/register';
import LoginView from '../views/login';
import HomepageView from '../views/homepage';
import jwt from 'jsonwebtoken';

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
        if (this.validateJWT()) {
            this.homepage();
            return;
        }
        this.layout.showChildView('content', new LoginView());
    },

    register () {
        this.layout.showChildView('content', new RegisterView());
    },

    homepage () {
        if (!this.validateJWT()) {
            this.login();
            return;
        }
        this.layout.showChildView('content', new HomepageView());
    },

    // The backend will check the validity of the JWT, this saves from unneeded calls
    // This function should be in auth/
    validateJWT () {
        let jwToken = localStorage.getItem(JWT_KEY);
        if (jwToken === null) {
            return false;
        }
        let decoded = jwt.decode(jwToken);
        // TODO: Find a more robust way to do this
        if (decoded !== null && decoded.exp > Math.floor(Date.now() / 1000)) {
            return true;
        }
        // The JWT was invalid
        localStorage.removeItem(JWT_KEY);
        return false;
    }
});
