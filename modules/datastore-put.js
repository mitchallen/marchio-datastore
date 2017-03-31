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
                preprocess = coreObject.preprocess,
                ds = coreObject.ds,
                app = coreObject.app;

            var updateDB = function(req, res, next) {

                var eMsg = '',
                    record = dsRecord.build( model.fields, req.body );

                if( ! record ) {
                    eMsg = `### ERROR: request fields failed validation`;
                    // console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return next();
                }

                const dbId = req.params._id,  // set by validateParams
                      key = ds.key( [ model.name, dbId ] ),
                      transaction = ds.transaction();

                transaction.run() 
                // .then( () => Promise.all([ transaction.get(key) ] ))
                .then( () => transaction.get(key))
                .then( function(result) {

                    // Merge old record (target) with new record (record)

                    const target = result[0];

                    if( target === undefined ) {
                        return Promise.reject(`No record found for id: ${dbId}`);
                    }

                    const merged = Object.assign(target, record);

                    const entity = {
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
                        .location( req.baseUrl + "/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(204)    // Not returning data
                        .end();
                    return;

                })
                .catch( (err) => {
                    // console.log("TRANSACTION ERROR: ", err);
                    transaction.rollback();
                    res
                        .status(404)    // Error may simply indicate entity not found
                        .end();
                    return;
                });
                
            };
            
            var path = '/:model/:id';

            if( preprocess ) {
                app.put( path, preprocess, updateDB );
            } else {
                app.put( path, updateDB );
            }

            resolve(app);
        });

    });

};