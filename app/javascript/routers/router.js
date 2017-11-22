import Mn from 'backbone.marionette';

/**
 * This is the application router which defines the routes available.
 * @module application/routers/app_router
 */
export default Mn.AppRouter.extend({
    /**
     * This is where the routes are defined.
     * @type {Object}
     */
    appRoutes: {
        '': 'login',
        register: 'register',
        homepage: 'homepage'
    }
});
