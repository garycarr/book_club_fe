import Router from '../../javascript/routers/router';
import Controller from '../../javascript/controllers/controller';

describe('router tests', function () {
    it('token router tests', function () {
        let router = new Router({
            controller: new Controller({
                appLayout: {}
            })
        });
        expect(router.controller).toBeDefined();
    });
});
