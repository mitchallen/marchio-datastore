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

                const query = ds.createQuery( model.name )
                    .filter('__key__', '=', ds.key([ model.name, dbId]))
                    .limit(1);

                ds.runQuery(query)
                .then((results) => {
                    const records = results[0];
                    if(records.length === 0 ) {
                        eMsg = `### '${dbId}' not found`;
                        console.log(eMsg);
                        res
                            .status(404)
                            .json({ error: eMsg });
                        return;
                    }

                    var list = [];
                    records.forEach((record) => {
                        const recordKey = record[ds.KEY];
                        list.push(record);
                    });

                    var source = list[0];   // original record
                    jsonpatch.apply(source, patches);
                    var key = ds.key( [ model.name, dbId ] );
                    var patchedRecord = dsRecord.build( model.fields, source );

                    var entity = {
                      key: key,
                      method: 'update',
                      data: patchedRecord
                    };

                    ds.save(entity).then(function(data) {

                        entity.data._id = key.id;

                        var record = entity.data || entity;

                        res
                            .location("/" + key.path.join('/') )  // .location("/" + model + "/" + doc._id)
                            .status(200)    // Not returning data
                            .json(record);

                    }).catch( function(err) { 
                        console.error(err); 
                        if(err) {
                            res
                                .status(500)
                                .json(err);
                        } 
                    });
                });
            };
            
            router.patch( '/:model/:id', getDB );

            resolve(router);
        });
    });
};