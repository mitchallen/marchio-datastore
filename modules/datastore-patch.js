/**
    Module: datastore-patch.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core'),
      dsRecord = require('./datastore-record'),
      jsonpatch = require('fast-json-patch');

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject){

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                ds = coreObject.ds,
                router = coreObject.router;

            var getDB = function(req, res, next) {

                var eMsg = '';
                if( req.params.model !== model.name ) {
                    eMsg = `### ERROR: '${req.params.model}' is not a valid database model`;
                    console.log(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                var patches = req.body;
                var dbId = parseInt(req.params.id, 10) || -1;
                if( dbId === -1 ) {
                    eMsg = `### ERROR: '${req.params.id}' is not a valid id`;
                    console.log(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                var key = ds.key( [ model.name, dbId ] );

                const transaction = ds.transaction();
                transaction.run() 
                // .then( () => Promise.all([ transaction.get(key) ] ))
                .then( () => transaction.get(key))
                .then( function(result) {

                    var source = result[0];   // original record
                    jsonpatch.apply(source, patches);
                    var key = ds.key( [ model.name, dbId ] );
                    var patchedRecord = dsRecord.build( model.fields, source );

                    var entity = {
                      key: key,
                      method: 'update',
                      data: patchedRecord
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
            
            router.patch( '/:model/:id', getDB );

            resolve(router);
        });
    });
};