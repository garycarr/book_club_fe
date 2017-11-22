import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import LayoutView     from './views/layout.js';
import AppRouter     from './routers/router';
import AppController from './controllers/controller';

export default Marionette.Application.extend({
  /**
   * Marionette callback called when start is called on the application
   * instance.
   */
    onStart () {
        this.layoutView = new LayoutView();
        this.layoutView.render();
        this.appRouter = this.createAppRouter(this.layoutView);
        Backbone.history.start();
    },
    /**
     * Given the root view will create the app controller (which requires the
     * root view) and router. Returns the app router when done.
     * @param  {View} appLayout The root Backbone view instance
     * @return {Router}         The app router
     */
    createAppRouter: function (appLayout) {
        return new AppRouter({
            controller: new AppController({
                layout: appLayout
            })
        });
    }
});
