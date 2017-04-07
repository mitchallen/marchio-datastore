/**
    Module: datastore-get.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core'),
      crFactory = require('marchio-core-record');

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject){

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                preprocess = coreObject.preprocess,
                ds = coreObject.ds,
                app = coreObject.app;

            var getDB = function(req, res, next) {

                var eMsg = '';

                var dbId = req.params._id;  // set by validateParams

                var query = ds.createQuery( model.name )
                    .filter('__key__', '=', ds.key([ model.name, dbId]))
                    .limit(1);

                var recMgr = null;

                crFactory.create( { model: model } )
                .then( (rm) => {
                    recMgr = rm;
                    return ds.runQuery(query);
                })
                .then( (results) => {

                    const records = results[0];

                    if(records.length === 0 ) {
                        // eMsg = `### '${dbId}' not found`;
                        // console.error(eMsg);
                        return Promise.reject(404);
                    }

                    var list = [];

                    records.forEach((record) => {
                        const recordKey = record[ds.KEY];
                        // console.log(recordKey.id, record );
                        // TODO - add back in id
                        list.push(record);
                    });

                    return Promise.resolve(list[0]);
                })
                .then( (body) => {
                    // console.log("BODY:", body );
                    if( req.query.fields ) {
                        return recMgr.fields( req.query.fields.split(" "), body );
                    } else {
                        return recMgr.select( body );
                    }
                })
                .then( (response) => {
                    // console.log( response );
                    response._id = dbId;
                    res
                        .location( req.baseUrl + "/" + [ model.name, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                        .status(200)    
                        .json(response);

                }).catch( function(err) { 
                    // console.error(err); 
                    if(err) {
                        if( err === 404 ) {
                            res
                                .status(404)
                                .json({ error: "not found" });
                        } else {
                            res
                                .status(500)
                                .json(err);
                        }
                    } 
                });
            };

            var path = '/:model/:id';

            if( preprocess ) {
                app.get( path, preprocess, getDB );
            } else {
                app.get( path, getDB );
            }

            resolve(app);
        });
    });
};