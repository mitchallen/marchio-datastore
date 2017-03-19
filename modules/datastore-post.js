/**
    Module: datastore-post.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core');
const dsRecord = require('./datastore-record');

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject){

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                ds = coreObject.ds,
                router = coreObject.router;

            var saveDB = function(req, res, next) {

                var eMsg = '';

                const record = dsRecord.build( model.fields, req.body );

                if( ! record ) {
                    eMsg = `### ERROR: request fields failed validation`;
                    console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                const key = ds.key( model.name );

                const entity = {
                  key: key,
                  data: record
                };

                ds.save(entity).then(function(data) {
  
                    var response = dsRecord.select( model.fields, entity.data || entity );
                    // Must call AFTER select or id will be filtered out
                    response._id = key.id;

                    res
                        .location("/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(201)    // Created
                        .json(response);

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                });
            };
            
            router.post( 
                '/:model', 
                dsCore.validateParams( { model: model } ), 
                saveDB 
            );


            resolve(router);
        });

    });

};