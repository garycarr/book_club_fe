import $   from 'jquery';
import App from './app';

/**
 * The applications main entry point.
 *
 * @module main
 */
$(document).ready(() => {
    let app = new App();
    app.start();
});
