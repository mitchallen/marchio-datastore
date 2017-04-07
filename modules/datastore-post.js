/**
    Module: datastore-post.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core');
const crFactory = require('marchio-core-record');

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject){

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                preprocess = coreObject.preprocess,
                ds = coreObject.ds,
                app = coreObject.app;

            var saveDB = function(req, res, next) {

                var eMsg = '';

                var recMgr = null,
                    key = null,
                    entity = null;

                crFactory.create( { model: model } )
                .then( (rm) => {
                    recMgr = rm;
                    return recMgr.build( req.body );
                })
                .then( (record) => {
                    if( ! record ) {
                        // eMsg = `### ERROR: request fields failed validation`;
                        // console.error(eMsg);
                        return Promise.reject(404);
                    }
                    // console.log("RECORD: ", record );
                    key = ds.key( model.name );
                    entity = {
                      key: key,
                      data: record
                    };
                    return ds.save(entity);
                })
                .then( (data) => {
                    // console.log("DATA: ", data );
                    return recMgr.select( entity.data || entity );
                })
                .then( (response) => {
                    // console.log("RESPONSE: ", response );
                    // Must call AFTER select or id will be filtered out
                    response._id = key.id;

                    res
                        .location( req.baseUrl + "/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(201)    // Created
                        .json(response);

                 }).catch( function(err) { 
                    // console.error(err); 
                    if(err) {
                        if( err === 404 ) {
                            res
                                .status(404)
                                .json({ error: "not found" });
                        } else {
                            res
                                .status(500)
                                .json(err);
                        }
                    } 
                });
            };

            var path = '/:model';

            if( preprocess ) {
                app.post( path, preprocess, saveDB );
            } else {
                app.post( path, saveDB );
            }

            resolve(app);
        });

    });

};