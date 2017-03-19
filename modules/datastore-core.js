/**
    Module: datastore-core.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const bodyParser = require('body-parser'),
      datastore = require('@google-cloud/datastore');

module.exports.validateParams = function( spec ) {

    spec = spec || {};
    const model = spec.model,
          demandId = spec.demandId || false;

    return function(req, res, next) {
        var eMsg = '';

        if( req.params.model !== model.name ) {
            eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
            console.error(eMsg);
            res
                .status(404)
                .json({ error: eMsg });
            return next('route');
        }

        if( demandId ) {

            // var dbId = req.params.id;    // would go in as 'name' and not 'id' (because it's a string)
            var dbId = parseInt( req.params.id, 10 ) || -1;

            if( dbId === -1 ) {
                // Invalid id format
                eMsg = `### ERROR: '${req.params.id}' is not a valid id`;
                // console.error(eMsg);
                res
                    .status(404)
                    .json({ error: eMsg });
                return;
            }

            req.params._id = dbId;
        }

        next();
    };
};

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

        resolve({
            model: model,
            projectId: projectId,
            ds: ds,
            router: router
        });
    });
};