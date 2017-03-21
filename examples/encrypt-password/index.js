"use strict";
 
var factory = require("marchio"),
    bcrypt = require('bcrypt'),
    // datastore = require('marchio-datastore');
    datastore = require('../../modules/index');
 
const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;
 
var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" },
        password: { type: String, select: false } 
    }
}

var hashPassword = function(req, res, next) {
    var eMsg = '';

    console.log("REQUEST METHOD: ", req.method );

    if( ! req.body ) {
        eMsg = "### ERROR: request has no body parameter";
        console.error(eMsg);
        res
            .status(404)
            .json({ error: eMsg });
        return next('route');
    }

    if( ! req.body.password ) {
        eMsg = "### ERROR: password parameter not submitted";
        console.error(eMsg);
        res
            .status(404)
            .json({ error: eMsg });
        return next('route');
    }

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            eMsg = `### ERROR: password hashing error: ${err.message}`;
            console.error(eMsg);
            res
                .status(404)
                .json({ error: err.message });
                return next('route');
        }

        req.body.password = hash;

        next();
    });
}
 
var _marchio = null;
 
factory.create({
    verbose: true
})
.then( (obj) => _marchio = obj )
.then( () => 
   datastore.create({
        projectId: GOOGLE_PROJECT_ID,
        model: _testModel,
        post: { use: hashPassword },
        get: true,
        put: true,
        del: true,
        patch: true
    })
)
.then( (dsApp) => _marchio.use(dsApp) )
.then( () => _marchio.listen( PORT ) )
.catch( (err) => { 
    console.error(err); 
}); 