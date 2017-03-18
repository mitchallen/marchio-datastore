/**
    Module: datastore-put.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core'),
      dsRecord = require('./datastore-record');

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

                var record = dsRecord.build( model.fields, req.body );

                if( ! record ) {
                    eMsg = `### ERROR: request fields failed validation`;
                    // console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                // For a PUT operation
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

                var key = ds.key( [ model.name, dbId ] );

                // console.log("KEY: ", key);

                const transaction = ds.transaction();

                transaction.run() 
                // .then( () => Promise.all([ transaction.get(key) ] ))
                .then( () => transaction.get(key))
                .then( function(result) {

                    // Merge old record (target) with new record (record)

                    let target = result[0];

                    if( target === undefined ) {
                        return Promise.reject(`No record found for id: ${dbId}`);
                    }

                    const merged = Object.assign(target, record);

                    var entity = {
                      key: key,
                      method: 'update',     // does not do partial update
                      // method: 'insert',  // will get already exists - can use in POST
                      // method: 'upsert',  // will create new record if non exists or update for existing key
                      data: merged
                    };

                    transaction.save(entity);
                })
                .then( () => transaction.commit() )
                .then( () => {

                    res
                        .location("/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(204)    // Not returning data
                        .end();

                })
                .catch( (err) => {
                    // console.log("TRANSACTION ERROR: ", err);
                    transaction.rollback();
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