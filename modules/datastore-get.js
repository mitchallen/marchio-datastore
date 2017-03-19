/**
    Module: datastore-get.js
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

            var getDB = function(req, res, next) {

                var eMsg = '';

                var dbId = req.params._id;  // set by validateParams

                var query = ds.createQuery( model.name )
                    .filter('__key__', '=', ds.key([ model.name, dbId]))
                    .limit(1);

                ds.runQuery(query)
                .then((results) => {

                    // console.log(results);
                    // [ [ { status: 'NEW', email: 'test290686@smoketest.cloud' } ],
                    //   { moreResults: 'NO_MORE_RESULTS',
                    //     endCursor: 'CjASK...=' } ]

                    const records = results[0];

                    if(records.length === 0 ) {
                        eMsg = `### '${dbId}' not found`;
                        // console.error(eMsg);
                        res
                            .status(404)
                            .json({ error: eMsg });
                        return;
                    }

                    var list = [];

                    records.forEach((record) => {
                        const recordKey = record[ds.KEY];
                        // console.log(recordKey.id, record );
                        // TODO - add back in id
                        list.push(record);
                    });

                    var response = {};

                    if( req.query.fields ) {
                        response = dsRecord.fields( req.query.fields.split(" "), list[0] );
                    } else {
                        response = dsRecord.select( model.fields, list[0] );
                    } 
   
                    response._id = dbId;

                    res
                        .location("/" + [ model.name, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(200)    
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

            router.get( 
                '/:model/:id', 
                dsCore.validateParams( { model: model, demandId: true } ),
                getDB 
            );

            resolve(router);
        });
    });
};