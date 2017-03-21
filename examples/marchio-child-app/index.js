"use strict";
 
var factory = require("marchio"),
    // datastore = require('marchio-datastore');
    datastore = require('../../modules/index');
 
const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;
 
var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" }, 
    }
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
        post: true,
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