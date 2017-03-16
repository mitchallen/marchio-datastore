/**
    Module: datastore-get.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core');

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
                    eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
                    console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                var _id = parseInt(req.params.id, 10);

                const query = ds.createQuery( model.name )
                    .filter('__key__', '=', ds.key([ model.name, _id]))
                    .limit(1);

                ds.runQuery(query)
                .then((results) => {

                    // console.log(results);
                    // [ [ { status: 'NEW', email: 'test290686@smoketest.cloud' } ],
                    //   { moreResults: 'NO_MORE_RESULTS',
                    //     endCursor: 'CjASK...=' } ]

                    const records = results[0];

                    if(records.length === 0 ) {
                        res
                            .status(404)
                            .end();
                        return;
                    }

                    var list = [];

                    records.forEach((record) => {
                        const recordKey = record[ds.KEY];
                        // console.log(recordKey.id, record );
                        // TODO - add back in id
                        list.push(record);
                    });

                    // TODO - what if not found???
                    var response = list[0];
                    response._id = _id;

                    res
                        .location("/" + [ model.name, _id ].join('/') )  // .location("/" + model + "/" + doc._id)
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
            
            router.get( '/:model/:id', getDB );

            resolve(router);
        });
    });
};