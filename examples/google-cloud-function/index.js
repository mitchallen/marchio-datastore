/*jshint node: true */
/*jshint esversion: 6 */

/*
 * Notes:
 *
 * The project must be setup for Google Cloud Functions and Google Datastore 
 *
 * To test:
 *     
 * URL Format: https://[REGION]-[GCLOUD_PROJECT].cloudfunctions.net/[FUNCTION_NAME]/[MODEL_NAME]/
 *
 * Example POST assuming:
 * 
 *     REGION = us-central1
 *     GCLOUD_PROJECT = myproject
 *     FUNCTION_NAME = myfunc
 *     MODEL_NAME = betalist
 *  
 * $ curl -i -X POST -H \"Content-Type: application/json\" \
 *        -d '{\"email\":\"func@funky.com\"}' \
 *        https://us-central1-myproject.cloudfunctions.net/myfunc/betalist/
 *
 * Take note of the location info in the response:
 *
 *     Location: /betalist/1234567890123456
 *
 * Integrate the location returned into a GET command:
 *
 * $ curl -i -X GET -H "Content-Type: application/json" \ 
 *   https://us-central1-myproject.cloudfunctions.net/myfunc/betalist/1234567890123456
 * 
 * Local Testing:
 *
 * Environment Setup:
 *
 * $ gcloud config set project myproject
 * $ export GCLOUD_PROJECT=myproject
 * $ node index.js 
 * Open a second terminal tab and run:
 * $ npm run test-local-post
 * 
 */

"use strict";

var factory = require("marchio-datastore"),
    express = require('express');

const MY_FUNC_NAME = process.env.FUNCTION_NAME,         // From Google Cloud Function env
      GOOGLE_PROJECT_ID = process.env.GCLOUD_PROJECT,   // From Google env / local env
      MODEL_NAME = 'betalist',
      NAME = require("./package").name,
      VERSION = require("./package").version,
      PORT = process.env.MARCHIO_PORT || 8080;  // For local testing only

var _testModel = {
    name: MODEL_NAME, 
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" }
    }
};

var app = express();

factory.create({
    model: _testModel,
    projectId: GOOGLE_PROJECT_ID,
    post: true,
    get: true
})
.then(function(dsApp) { 
    app.use(dsApp);   
})
.catch( function(err) { 
    console.error(err); 
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`[${NAME} ${VERSION}] listening on port ${PORT}`);
  });
} else {
    if(MY_FUNC_NAME) {
        exports[MY_FUNC_NAME] = app;
    }
}



