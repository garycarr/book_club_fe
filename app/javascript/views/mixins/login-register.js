import $ from 'jquery';

export default {
    removeErrorMessages: function (el, dataPrefix, attrs) {
        el.find(`label[${dataPrefix}-error]`).attr('hidden', true);
        $.each(attrs, function (attr) {
            el.find(`label[${dataPrefix}-error-${attr}]`).attr('hidden', true);
        });
    },
    showErrorMessages: function (el, dataPrefix, validationErrors) {
        validationErrors.forEach(function (error) {
            el.find(`label[${dataPrefix}-error-${error.name}]`).removeAttr('hidden');
        });
    }

};
