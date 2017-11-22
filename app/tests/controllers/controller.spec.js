import Controller from '../../javascript/controllers/controller';

describe('controller tests', function () {
    it('token controller tests', function () {
        let controller = new Controller({
            layout: {}
        });
        expect(controller.layout).toBeDefined();
    });
});
