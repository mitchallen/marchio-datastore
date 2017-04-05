/**
    Module: datastore-core.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const   coreRouter = require('./core-app'),
        datastore = require('@google-cloud/datastore');

module.exports.create = ( spec ) => {

    return coreRouter.create( spec )
    .then( (coreObject) => {

        return new Promise((resolve, reject) => {

            spec = spec || {};

            const projectId = spec.projectId;

            if( ! projectId ) {
                reject( new Error(".create: projectId must be defined"));
            }

            coreObject.ds = datastore({
                projectId: projectId
            });

            resolve(coreObject);
        });
    });
};