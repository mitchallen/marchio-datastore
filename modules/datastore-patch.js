/**
    Module: datastore-patch.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core'),
      crFactory = require('marchio-core-record'),
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

                const patches = req.body;

                var eMsg = '',
                    record = null,
                    recMgr = null,
                    dbId = null,  
                    key = null,
                    transaction = null;

                crFactory.create( { model: model } )
                .then( (rm) => {
                    recMgr = rm;
                    dbId = req.params._id;  // set by validateParams
                    key = ds.key( [ model.name, dbId ] );
                    transaction = ds.transaction();
                    return transaction.run();
                }) 
                // .then( () => Promise.all([ transaction.get(key) ] ))
                .then( () => transaction.get(key))
                .then( (result) => {

                    const source = result[0];   // original record
                    jsonpatch.apply(source, patches);
                    
                    const key = ds.key( [ model.name, dbId ] );
                    return recMgr.build( source );
                })
                .then( (patchedRecord) => {
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
                        .location( req.baseUrl + "/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
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