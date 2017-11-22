import mn from 'backbone.marionette';
import template from '../templates/header.hbs';
import { HEADER_STRINGS } from '../common/strings';

export default mn.View.extend({
    tagName: 'div',
    template,

    templateContext: function () {
        return {
            title: HEADER_STRINGS.TITLE
        };
    }
});
