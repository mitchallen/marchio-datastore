/**
    Module: datastore-core.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const   coreRouter = require('./core-router'),
        datastore = require('@google-cloud/datastore');

module.exports.create = ( spec ) => {

    return coreRouter.create( spec )
    .then( (coreObject) => {

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                // ds = coreObject.ds,
                router = coreObject.router;

            const ds = datastore({
                projectId: projectId
            });

            resolve({
                model: model,
                projectId: projectId,
                ds: ds,
                router: router
            });
        });
    });
};