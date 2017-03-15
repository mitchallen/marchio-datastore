/**
    Module: marchio-datastore
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const express = require('express'),
      app = express(),
      router = express.Router(),
      bodyParser = require('body-parser'),
      datastore = require('@google-cloud/datastore'),
      postRouter = require('./datastore-post'),
      getRouter = require('./datastore-get');

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
 * @param {boolean} spec.post Allow HTTP POST
 * @param {boolean} spec.get Allow HTTP GET
 * @param {boolean} spec.put Allow HTTP PUT (Feature Not Implemented Yet)
 * @param {boolean} spec.patch Allow HTTP PATCH (Feature Not Implemented Yet)
 * @param {boolean} spec.del Allow HTTP DELETE (Feature Not Implemented Yet)
 * @returns {Promise} that resolves to {module:marchio-datastore}
 * @example <caption>Usage example</caption>
 * var factory = require("marchio-datastore");
 *
 * const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
 *       PORT = process.env.MARCHIO_PORT || 8080;
 *
 * var _testModel = {
 *     name: 'user',
 *     fields: {
 *         email:    { type: String, required: true },
 *         status:   { type: String, required: true, default: "NEW" }
 *     }
 * };
 *
 * factory.create({
 *     model: _testModel,
 *     projectId: GOOGLE_PROJECT_ID
 *     post: true,
 *     get: true
 * })
 * .then(function(app) {
 *     app.listen(PORT, () => {
 *         console.log(`listening on port ${PORT}`);   
 *     });
 *})
 * .catch( function(err) { 
 *     console.error(err); 
 * });
 */

module.exports.create = ( spec ) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        var model = spec.model,
            projectId = spec.projectId,
            middleware = spec.use,
            // Allow HTTP method flags
            post = spec.post || false,
            get = spec.get || false,
            put = spec.put || false,
            patch = spec.patch || false,
            del = spec.del || false;

        if( ! model ) {
            return reject( new Error(_ERROR.MODEL_MUST_BE_DEFINED));
        }

        if( ! model.name ) {
            return reject ( new Error(_ERROR.MODEL_NAME_MUST_BE_DEFINED));
        }

        if( ! projectId ) {
            return reject( new Error(_ERROR.PROJECT_ID_MUST_BE_DEFINED));
        }

        model.fields = model.fields || {};

        const ds = datastore({
            projectId: projectId
        });

        // Automatically parse request body as JSON
        app.use(bodyParser.json());
        if( middleware ) {
            app.use(middleware);
        }

        var routes = [];

        if( post ) routes.push( postRouter.create({ projectId: projectId, model: model }));
        if( get  ) routes.push( getRouter.create( { projectId: projectId, model: model })); 

        if(routes.length === 0) {
            return reject(new Error(_ERROR.NO_HTTP_METHODS_ENABLED));
        }      

        Promise.all(routes)
        .then( function(routers) {
            app.use(routers);
        })
        .then( function() {
            resolve(app);
        })
        .catch( function(err) { 
            // console.error(err); 
            console.error(`datastore: ${err.message}`);
            reject(err);
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
    MODEL_MUST_BE_DEFINED:      "datastore.create: model must be defined",
    MODEL_NAME_MUST_BE_DEFINED: "datastore.create: model.name must be defined",
    PROJECT_ID_MUST_BE_DEFINED: "datastore.create: projectId must be defined",
    NO_HTTP_METHODS_ENABLED:    "datastore.create: No HTTP methods enabled"    
};
