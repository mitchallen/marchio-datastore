/**
    Module: datastore-core.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const bodyParser = require('body-parser'),
      datastore = require('@google-cloud/datastore');

function validateParams(model) {
    return function(req, res, next) {
        var eMsg = '';

        // console.log(`req.params.model: ${req.params.model}`);

        // console.log("CORE-PARAMS:", req.params );

        if( req.params.model !== model.name ) {
            eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
            console.error(eMsg);
            res
                .status(404)
                .json({ error: eMsg });
            return next('route');
        }

        next();
    };
}

module.exports.validateParams = validateParams;

module.exports.create = ( spec ) => {

    return new Promise((resolve, reject) => {

        const express = require('express'),
              router = express.Router();
      
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
        router.use(bodyParser.json());

        if(middleware) {
            router.use(middleware);
        }

        // router.use(validateParams(model.name));

        resolve({
            model: model,
            projectId: projectId,
            ds: ds,
            router: router
        });
    });
};