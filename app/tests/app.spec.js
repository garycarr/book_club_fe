import App from '../javascript/app';

describe('app initialize tests', function () {
    it('token tests, these need to be a lot deeper', function () {
        let app = new App();
        app.start();
        expect(app.layoutView).toBeDefined();
        expect(app.appRouter).toBeDefined();
    });
});
