/**
    Module: datastore-delete.js
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

            var delDB = function(req, res, next) {

                var eMsg = '';

                if( req.params.model !== model.name ) {
                    eMsg = `### ERROR: '${req.params.model}'' is not a valid database model`;
                    console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return;
                }

                var _id = parseInt(req.params.id, 10) || -1;

                if( _id === -1 ) {
                    res
                        .status(200)
                        .end();
                    return;
                }

                ds.delete(ds.key([ model.name, _id]))
                .then((results) => {
                    res
                        .status(200)    
                        .json({ status: "OK" });

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                });

            };
            
            router.delete( '/:model/:id', delDB );

            resolve(router);
        });
    });
};