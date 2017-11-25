import Controller from '../../javascript/controllers/controller';
import jwt from 'jsonwebtoken';

let validToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour in future
}, 'secret');

let invalidToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) - (24 * 60 * 60) // 24 hours in the past
}, 'secret');

describe('controller tests', function () {
    // TODO: mock this, need a fake layout
    // it('should go to homepage with valid JWT', function () {
    //     let localStorageStub = sinon.stub(localStorage, 'getItem').returns(validToken);
    //     let controller = new Controller({
    //         layout: {
    //
    //         }
    //     });
    //     let childViewLoginSpy = sinon.stub(controller.showChildView);
    //     controller.homepage();
    //     expect(childViewLoginSpy.calledOnce).toBe(true);
    //     localStorageStub.restore();
    //     childViewLoginSpy.restore();
    // });

    it('should go to home page with a valid JWT', function () {
        let localStorageStub = sinon.stub(localStorage, 'getItem').returns(validToken);
        let controller = new Controller({
            layout: {}
        });
        let childViewHomepageStub = sinon.stub(controller, 'homepage');
        controller.login();
        expect(childViewHomepageStub.calledOnce).toBe(true);
        localStorageStub.restore();
        childViewHomepageStub.restore();
    });

    it('should go to login page with invalid JWT', function () {
        let localStorageStub = sinon.stub(localStorage, 'getItem').returns(invalidToken);
        let controller = new Controller({
            layout: {}
        });
        let childViewLoginStub = sinon.stub(controller, 'login');
        controller.homepage();
        expect(childViewLoginStub.calledOnce).toBe(true);
        localStorageStub.restore();
        childViewLoginStub.restore();
    });

    it('should validate JWT', function () {
        let localStorageStub = sinon.stub(localStorage, 'getItem').returns(validToken);
        let controller = new Controller({
            layout: {}
        });
        expect(controller.validateJWT()).toBe(true);
        localStorageStub.restore();
    });
    it('should not validate JWT', function () {
        let localStorageStub = sinon.stub(localStorage, 'getItem').returns(invalidToken);
        let controller = new Controller({
            layout: {}
        });
        expect(controller.validateJWT()).toBe(false);
        localStorageStub.restore();
    });
});
