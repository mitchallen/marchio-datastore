/**
    Module: datastore-record.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

module.exports.build = function( fields, body ) {
    var record = {};
    for (var property in fields) {
        if (fields.hasOwnProperty(property)) {
            // console.log("PROPERTY:", property );
            var fld = fields[ property ];
            // console.log("...:", fld  );
            if( fld.required ) {
                if( ! body.hasOwnProperty(property)) {
                    if( fld.default ) {
                        record[property] = fld.default;
                    } else {
                        var eMsg = `### ERROR: '${property}' is a required field`;
                        console.error(eMsg);
                        return null;
                    }
                }
            }
            if(body[property]) {
                record[property] = body[property];
            } else if( fld.default ) {
                record[property] = fld.default;
            }
        }
    }
    return record;
};

