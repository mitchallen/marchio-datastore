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

                const dbId = req.params._id;  // set by validateParams

                ds.delete(ds.key([ model.name, dbId ]))
                .then((results) => {
                    res
                        .status(200)    
                        .end();

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                });
            };
            
            router.delete( 
                '/:model/:id', 
                delDB 
            );

            resolve(router);
        });
    });
};