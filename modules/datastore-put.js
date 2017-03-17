/**
    Module: datastore-put.js
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

            var updateDB = function(req, res, next) {

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
                    // console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                // console.log(record);

                // console.log("MODEL NAME: ", model.name );

                // For a PUT operation
                // var dbId = req.params.id;    // would go in as 'name' and not 'id' (because it's a string)
                var dbId = parseInt( req.params.id, 10 ) || -1;
                // console.log('ID: ', dbId );

                if( dbId === -1 ) {

                    // Invalid id format
                    eMsg = `### ERROR: '${req.params.id}' is not a valid id`;
                    // console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                var key = ds.key( [ model.name, dbId ] );

                // console.log("KEY: ", key);

                // For a POST operation
                // var key = ds.key( model.name );

                var entity = {
                  key: key,
                  method: 'update',
                  // method: 'insert',  // will get already exists - can use in POST
                  // method: 'upsert',
                  data: record
                };

                // console.log("ENTITY: ", entity);

                ds.save(entity).then(function(data) {
                    // var apiResponse = data[0];

                    // console.log("=== SAVE DATA ===");
                    // console.log(JSON.stringify(data,null,2));
                    // console.log("^^^ SAVE DATA ^^^"); 

                    // console.log(key.path); // [ 'Company', 5669468231434240 ]
                    // console.log(key.namespace); // undefined

                    entity.data._id = key.id;

                    var record = entity.data || entity;

                    res
                        .location("/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(204)    // Not returning data
                        .json(record);

                }).catch( function(err) { 
                    // console.error(err); 
                    // if(err) {
                    //     res
                    //         .status(500)
                    //         .json(err);
                    // } 

                    res
                        .status(404)    // Error may simply indicate entity not found
                        .end();
                });
            };
            
            router.put( '/:model/:id', dsCore.validateParams(model), updateDB );

            // router.post( '/:model', saveDB );

            resolve(router);
        });

    });

};