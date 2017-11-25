import Backbone from 'backbone';
import _ from 'lodash';
import { JWT_KEY } from '../common/constants';

let _sync = Backbone.sync;


/**
 * This module overrides the sync method to provide support for JSON Web Tokens.
 *
 * @module auth
 */

/**
 * Overrides Backbone.sync to provide support for JSON Web Token Authentication. Assumes the JWT is
 * stored in localStorage at the Backbone.JWT_KEY variable.
 *
 * @param  {String} method  The HTTP method for the sync request.
 * @param  {Object} model   The model object to sync.
 * @param  {Object} options Any additional options for the sync request.
 */
Backbone.sync = function (method, model, options) {
    let jwt = localStorage.getItem(JWT_KEY);

    if (jwt) {
        options.headers = _.extend({}, options.headers, {
            Authorization: `Bearer ${jwt}`
        });
    }

    return _sync.call(this, method, model, options);
};

export default Backbone.Sync;
