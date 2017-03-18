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

                // if( req.params.model !== model.name ) {
                //     eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
                //     console.error(eMsg);
                //     res
                //         .status(404)
                //         .json({ error: eMsg });
                //     return;
                // }

                var record = dsRecord.build( model.fields, req.body );

                if( ! record ) {
                    eMsg = `### ERROR: request fields failed validation`;
                    console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                // console.log(record);

                // console.log("MODEL NAME: ", model.name );

                // For a PUT operation:
                // var dbId = parseInt(id,10);
                // var key = datastore.key( [ model.name, dbId ] );

                var key = ds.key( model.name );
                var entity = {
                  key: key,
                  data: record
                };

                ds.save(entity).then(function(data) {
                    // var apiResponse = data[0];

                    // console.log("=== SAVE DATA ===");
                    // console.log(JSON.stringify(data,null,2));
                    // console.log("^^^ SAVE DATA ^^^"); 

                    // console.log(key.path); // [ 'Company', 5669468231434240 ]
                    // console.log(key.namespace); // undefined

                    var record = dsRecord.select( model.fields, entity.data || entity );
                    // Must call AFTER select or id will be filtered out
                    record._id = key.id;

                    res
                        .location("/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(201)    // Created
                        .json(record);

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                });
            };
            
            router.post( '/:model', dsCore.validateParams(model), saveDB );

            // router.post( '/:model', saveDB );

            resolve(router);
        });

    });

};