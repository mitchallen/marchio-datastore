/**
    Module: datastore-post.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const dsCore = require('./datastore-core');

var buildRecord = function( fields, req ) {
    var record = {};
    for (var property in fields) {
        if (fields.hasOwnProperty(property)) {
            // console.log("PROPERTY:", property );
            var fld = fields[ property ];
            // console.log("...:", fld  );
            if( fld.required ) {
                if( ! req.body.hasOwnProperty(property)) {
                    if( fld.default ) {
                        record[property] = fld.default;
                    } else {
                        var eMsg = `### ERROR: '${property}' is a required field`;
                        console.error(eMsg);
                        return null;
                    }
                }
            }
            if(req.body[property]) {
                record[property] = req.body[property];
            } else if( fld.default ) {
                record[property] = fld.default;
            }
        }
    }
    return record;
};

module.exports.create = ( spec ) => {

    return dsCore.create( spec )
    .then(function(coreObject){

        return new Promise((resolve, reject) => {

            var model = coreObject.model,
                projectId = coreObject.projectId,
                middleware = coreObject.use,
                ds = coreObject.ds,
                router = coreObject.router;

            var saveDB = function(req, res, next) {

                var eMsg = '';

                // if( req.params.model !== model.name ) {
                //     eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
                //     console.error(eMsg);
                //     res
                //         .status(404)
                //         .json({ error: eMsg });
                //     return;
                // }

                var record = buildRecord( model.fields, req );

                if( ! record ) {
                    eMsg = `### ERROR: request fields failed validation`;
                    console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                // console.log(record);

                // console.log("MODEL NAME: ", model.name );

                // For a PUT operation:
                // var dbId = parseInt(id,10);
                // var key = datastore.key( [ model.name, dbId ] );

                var key = ds.key( model.name );
                var entity = {
                  key: key,
                  data: record
                };

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
                        .status(201)    // Created
                        .json(record);

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                });
            };
            
            router.post( '/:model', dsCore.validateParams(model), saveDB );

            // router.post( '/:model', saveDB );

            resolve(router);
        });

    });

};