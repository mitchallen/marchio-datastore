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
                preprocess = coreObject.preprocess,
                ds = coreObject.ds,
                app = coreObject.app;

            var patchDB = function(req, res, next) {

                const patches = req.body,
                      dbId = req.params._id,  // set by validateParams
                      key = ds.key( [ model.name, dbId ] ),
                      transaction = ds.transaction();

                transaction.run() 
                // .then( () => Promise.all([ transaction.get(key) ] ))
                .then( () => transaction.get(key))
                .then( function(result) {

                    const source = result[0];   // original record
                    jsonpatch.apply(source, patches);
                    
                    const key = ds.key( [ model.name, dbId ] ),
                          patchedRecord = dsRecord.build( model.fields, source );

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
            
            var path = '/:model/:id';

            if( preprocess ) {
                app.patch( path, preprocess, patchDB );
            } else {
                app.patch( path, patchDB );
            }

            resolve(app);
        });
    });
};