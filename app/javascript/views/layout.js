import mn from 'backbone.marionette';
import template from '../templates/layout.hbs';
import headerView from './header';
import footerView from './footer';

export default mn.View.extend({
    el: 'body', // Attaches to the body
    tagName: 'div',
    template,
    regions: {
        header: '#header',
        content: '#content',
        footer: '#footer'
    },

    onRender: function () {
        this.showChildView('header', new headerView());
        this.showChildView('footer', new footerView());
    }
});
