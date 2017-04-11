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
                preprocess = coreObject.preprocess,
                ds = coreObject.ds,
                app = coreObject.app;

            var delDB = function(req, res, next) {

                var eMsg = '';

                const dbId = req.params._id;  

                ds.delete(ds.key([ model.name, dbId ]))
                .then((results) => {
                    res
                        .status(204)    
                        .end();
                    return next();

                }).catch( function(err) { 
                    console.error(err); 
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } 
                    return next();
                });
            };

            var path = '/:model/:id';

            if( preprocess ) {
                app.delete( path, preprocess, delDB );
            } else {
                app.delete( path, delDB );
            }

            resolve(app);
        });
    });
};