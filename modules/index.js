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
 * @returns {Promise} that resolves to {module:marchio-datastore}
 * @example <caption>Usage example</caption>
    var factory = require("marchio-datastore");
 
    factory.create({})
    .then(function(obj) {
        return obj.health();
    })
    .catch( function(err) { 
        console.error(err); 
    });
 */

module.exports.create = ( spec ) => {

    return new Promise((resolve, reject) => {

        spec = spec || {};

        var model = spec.model,
            projectId = spec.projectId,
            middleware = spec.use;

        if( ! model ) {
            reject( new Error(".create: model must be defined"));
        }

        if( ! model.name ) {
            reject ( new Error(".create: model.name must be defined"));
        }

        if( ! projectId ) {
            reject( new Error(".create: projectId must be defined"));
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

        Promise.all([
            postRouter.create({ projectId: projectId, model: model }),
            getRouter.create({ projectId: projectId, model: model })
            // TODO - insert other routers
        ])
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