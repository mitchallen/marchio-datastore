/**
    Module: marchio-datastore
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const bodyParser = require('body-parser'),
      datastore = require('@google-cloud/datastore'),
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
 * @param {boolean} spec.post Allow HTTP POST
 * @param {boolean} spec.get Allow HTTP GET
 * @param {boolean} spec.put Allow HTTP PUT
 * @param {boolean} spec.del Allow HTTP DELETE
 * @param {boolean} spec.patch Allow HTTP PATCH 
 * @returns {Promise} that resolves to an expressjs app
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
 *         status:   { type: String, required: true, default: "NEW" },
 *         // In a real world example this would have been hashed in middleware and not stored as plain text
 *         password: { type: String, select: false },  // select: false, exclude from query results
 *     }
 * };
 *
 * factory.create({
 *     model: _testModel,
 *     projectId: GOOGLE_PROJECT_ID
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
 */

module.exports.create = ( spec ) => {

    return new Promise((resolve, reject) => {

        var express = require('express');

        var app = express(),
            router = express.Router();

        spec = spec || {};

        var model = spec.model,
            projectId = spec.projectId,
            middleware = spec.use,
            // Allow HTTP method flags
            post = spec.post || false,
            get = spec.get || false,
            put = spec.put || false,
            del = spec.del || false,
            patch = spec.patch || false;

        // console.log(spec);

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

        if( post  ) routes.push( postRouter.create(  { projectId: projectId, model: model } ) );
        if( put   ) routes.push( putRouter.create(   { projectId: projectId, model: model } ) );
        if( get   ) routes.push( getRouter.create(   { projectId: projectId, model: model } ) ); 
        if( del   ) routes.push( delRouter.create(   { projectId: projectId, model: model } ) );
        if( patch ) routes.push( patchRouter.create( { projectId: projectId, model: model } ) );

        if(routes.length === 0) {
            return reject(new Error(_ERROR.NO_HTTP_METHODS_ENABLED));
        }      

        Promise.all(routes)
        .then( function(routers) {

            app.use(routers);

            // console.log("app._router.stack.length: ", app._router.stack.length );

            // app._router.stack.forEach(function(r){
            //     if(r.route){ // routes registered directly on the app
            //       if (r.route && r.route.path){
            //              console.log("ROUTE: ", r.route.path);
            //       }
            //     } else if(r.name === 'router'){ // router middleware 
            //         console.log("app._router.handle.stack.length: ", r.handle.stack.length );
            //         r.handle.stack.forEach(function(handler){
            //             if (handler.route && handler.route.path){
            //                 console.log("HANDLER: ", handler.route.path);
            //                 // console.log("HANDLER-ROUTE: ", handler.route);
            //                 handler.route.stack.forEach(function(layer) {
            //                     console.log(" -> LAYER METHOD: ", layer.method);
            //                 }); 
            //             }
            //         });
            //     }
            // });
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
