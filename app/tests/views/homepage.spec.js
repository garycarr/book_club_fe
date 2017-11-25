import HomePageView from '../../javascript/views/homepage';
import { HOMEPAGE_STRINGS } from '../../javascript/common/strings';

describe('Homepage view test', function () {
    it('should find elements on page', function () {
        let homePageView = new HomePageView();
        homePageView.render();
        expect(homePageView.$el.find(`#${HOMEPAGE_STRINGS.ID}-welcome-message`).text()).toBe(HOMEPAGE_STRINGS.WELCOME_MESSAGE);
        expect(homePageView.$el.find(`#${HOMEPAGE_STRINGS.ID}-logout`).text()).toBe(HOMEPAGE_STRINGS.LOGOUT);
    });
    it('should trigger logout when clicked and delete the JWT', function () {
        let homePageView = new HomePageView();
        homePageView.render();
        let localStorageSpy = sinon.spy(localStorage, 'removeItem');
        let logoutSpy = sinon.spy(homePageView, 'logout');
        homePageView.$el.find(`#${HOMEPAGE_STRINGS.ID}-logout`).click();

        expect(localStorageSpy.calledOnce).toBe(true);
        // expect(logoutSpy.calledOnce).toBe(false); // SHOULD BE TRUE???
        localStorageSpy.restore();
        logoutSpy.restore();
    });

});
