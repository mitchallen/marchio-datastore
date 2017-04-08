/**
    Module: marchio-datastore
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const bodyParser = require('body-parser'),
      dsCore = require('./datastore-core'),
      postRouter = require('./datastore-post'),
      putRouter = require('./datastore-put'),
      getRouter = require('./datastore-get'),
      delRouter = require('./datastore-delete'),
      patchRouter = require('./datastore-patch');

/**
 * Module
 * @module marchio-datastore
 */

/**
 * 
 * Factory module
 * @module marchio-datastore-factory
 */

 /** 
 * Factory method 
 * It takes one spec parameter that must be an object with named parameters
 * @param {Object} spec Named parameters object
 * @param {String} [spec.path] Base path (like "/api" or "/v1")
 * @param {boolean} [spec.post] Allow HTTP POST
 * @param {boolean} [spec.get] Allow HTTP GET
 * @param {boolean} [spec.put] Allow HTTP PUT
 * @param {boolean} [spec.del] Allow HTTP DELETE
 * @param {boolean} [spec.patch] Allow HTTP PATCH 
 * @returns {Promise} that resolves to an expressjs app
 * @example <caption>Environment setup</caption>
 * $ export MARCHIO_GOOGLE_PROJECT_ID='my-project-id'
 * $ export MARCHIO_PORT=8080
 * @example <caption>Child app of marchio example</caption>
 * "use strict";
 *  
 * var factory = require("marchio"),
 *     datastore = require('marchio-datastore');
 *  
 * const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
 *       PORT = process.env.MARCHIO_PORT || 8080;
 *  
 * var _testModel = {
 *     name: 'user',
 *     fields: {
 *         email:    { type: String, required: true },
 *         status:   { type: String, required: true, default: "NEW" }, 
 *     }
 * }
 * 
 * var _marchio = null;
 *  
 * factory.create({
 *     verbose: true
 * })
 * .then( (obj) => _marchio = obj )
 * .then( () => 
 *    datastore.create({
 *         projectId: GOOGLE_PROJECT_ID,
 *         model: _testModel,
 *         post: true,
 *         get: true,
 *         put: true,
 *         del: true,
 *         patch: true
 *     })
 * )
 * .then( (dsApp) => _marchio.use(dsApp) )
 * .then( () => _marchio.listen( PORT ) )
 * .catch( (err) => { 
 *    console.error(err); 
 * }); 
 * @example <caption>curl testing</caption>
 * $ curl -i -X POST -H "Content-Type: application/json" \
 *     -d '{"email":"test@demo.com"}' http://localhost:8080/user
 *
 * $ curl -i -X GET -H "Accept: applications/json" \
 *     http://localhost:8080/user/1234567890123456
 *
 * $ curl -i -X PUT -H "Content-Type: application/json" \
 *     -d '{"email":"test@demo.com", "status":"UPDATED"}' \
 *     http://localhost:8080/user/1234567890123456
 *
 * $ curl -i -X PATCH -H "Content-Type: application/json" \
 *     -d '[{"op":"replace","path":"/status","value":"PATCH"}]' \
 *     http://localhost:8080/user/1234567890123456
 *
 * $ curl -i -X DELETE -H "Content-Type: application/json" \
 *     http://localhost:8080/user/1234567890123456
 * @example <caption>Main app example</caption>
 * var factory = require("marchio-datastore");
 *
 * const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
 *       PORT = process.env.MARCHIO_PORT || 8080;
 *
 * var _testModel = {
 *     name: 'user',
 *     fields: {
 *         email:    { type: String, required: true },
 *         status:   { type: String, required: true, default: "NEW" },
 *         password: { type: String, select: false },  // select: false, exclude from query results
 *     }
 * };
 *
 * factory.create({
 *     model: _testModel,
 *     projectId: GOOGLE_PROJECT_ID,
 *     post: true,
 *     get: true,
 *     put: true,
 *     del: true,
 *     patch: true
 * })
 * .then(function(app) {
 *     app.listen(PORT, () => {
 *         console.log(`listening on port ${PORT}`);   
 *     });
 *})
 * .catch( function(err) { 
 *     console.error(err); 
 * });
 * @example <caption>Path based example</caption>
 * var factory = require("marchio-datastore");
 *
 * const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
 *       PORT = process.env.MARCHIO_PORT || 8080;
 *
 * var _testModel = {
 *     name: 'user',
 *     fields: {
 *         email:    { type: String, required: true },
 *         status:   { type: String, required: true, default: "NEW" },
 *         password: { type: String, select: false },  // select: false, exclude from query results
 *     }
 * };
 *
 * factory.create({
 *     model: _testModel,
 *     projectId: GOOGLE_PROJECT_ID,
 *     path: '/api',
 *     post: true,
 *     get: true,
 *     put: true,
 *     del: true,
 *     patch: true
 * })
 * .then(function(app) {
 *     app.listen(PORT, () => {
 *         console.log(`listening on port ${PORT}`);   
 *     });
 *})
 * .catch( function(err) { 
 *     console.error(err); 
 * });
 * @example <caption>path-based curl testing</caption>
 * $ curl -i -X POST -H "Content-Type: application/json" \
 *     -d '{"email":"test@demo.com"}' http://localhost:8080/api/user
 *
 * $ curl -i -X GET -H "Accept: applications/json" \
 *     http://localhost:8080/api/user/1234567890123456
 *
 * $ curl -i -X PUT -H "Content-Type: application/json" \
 *     -d '{"email":"test@demo.com", "status":"UPDATED"}' \
 *     http://localhost:8080/api/user/1234567890123456
 *
 * $ curl -i -X PATCH -H "Content-Type: application/json" \
 *     -d '[{"op":"replace","path":"/status","value":"PATCH"}]' \
 *     http://localhost:8080/api/user/1234567890123456
 *
 * $ curl -i -X DELETE -H "Content-Type: application/json" \
 *     http://localhost:8080/api/user/1234567890123456
 */

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject) {

        return new Promise((resolve, reject) => {

            spec = spec || {};

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                ds = coreObject.ds,
                // Do NOT use numeric - keys are auto-generated numbers, will mess up get calls
                // numeric = spec.numeric === undefined ? true : spec.numeric,
                app = coreObject.app,   
                path = coreObject.path,
                post = spec.post || false,
                get = spec.get || false,
                put = spec.put || false,
                del = spec.del || false,
                patch = spec.patch || false;

            model.fields = model.fields || {};

            var routes = [];

            var routeSpec = function( rParams ) {

                return { 
                    projectId: projectId, model: model, 
                    // Do NOT use numeric - keys are auto-generated numbers, will mess up get calls
                    // numeric: numeric,
                    preprocess: rParams.preprocess ? rParams.preprocess : null 
                };
            };

            if( post  ) routes.push( postRouter.create(  routeSpec( post  ) ) );
            if( put   ) routes.push( putRouter.create(   routeSpec( put   ) ) );
            if( get   ) routes.push( getRouter.create(   routeSpec( get   ) ) ); 
            if( del   ) routes.push( delRouter.create(   routeSpec( del   ) ) );
            if( patch ) routes.push( patchRouter.create( routeSpec( patch ) ) );

            if(routes.length === 0) {
                return reject(new Error(_ERROR.NO_HTTP_METHODS_ENABLED));
            }      

            Promise.all(routes)
            .then( function(children) {
                if( path ) {
                    app.use( path, children );
                } else {
                    app.use(children);
                }
            })
            .then( function() {
                resolve(app);
            })
            .catch( function(err) { 
                console.error(`datastore: ${err.message}`);
                reject(err);
            });
        });
    });
};

/**
 * 
 * Error module
 * @module marchio-datastore-ERROR
 * @param {string} ```MODEL_MUST_BE_DEFINED``` - datastore.create: model must be defined
 * @param {string} ```MODEL_NAME_MUST_BE_DEFINED``` - datastore.create: model.name must be defined
 * @param {string} ```PROJECT_ID_MUST_BE_DEFINED``` - datastore.create: projectId must be defined
 * @param {string} ```NO_HTTP_METHODS_ENABLED``` - datastore.create: No HTTP methods enabled
 * @example <caption>Usage example</caption>
 .catch( (err) => {
    if( err.message == _factory.ERROR.MODEL_MUST_BE_DEFINED ) {
        ...
    }
}
 */
var _ERROR = module.exports.ERROR = {
    MODEL_MUST_BE_DEFINED:      ".create: model must be defined",
    MODEL_NAME_MUST_BE_DEFINED: "datastore.create: model.name must be defined",
    PROJECT_ID_MUST_BE_DEFINED: "datastore.create: projectId must be defined",
    NO_HTTP_METHODS_ENABLED:    "datastore.create: No HTTP methods enabled"    
};
