marchio-datastore
==
REST to Google Datastore Mapper
--

<p align="left">
  <a href="https://travis-ci.org/mitchallen/marchio-datastore">
    <img src="https://img.shields.io/travis/mitchallen/marchio-datastore.svg?style=flat-square" alt="Continuous Integration">
  </a>
  <a href="https://codecov.io/gh/mitchallen/marchio-datastore">
    <img src="https://codecov.io/gh/mitchallen/marchio-datastore/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
  <a href="https://npmjs.org/package/marchio-datastore">
    <img src="http://img.shields.io/npm/dt/marchio-datastore.svg?style=flat-square" alt="Downloads">
  </a>
  <a href="https://npmjs.org/package/marchio-datastore">
    <img src="http://img.shields.io/npm/v/marchio-datastore.svg?style=flat-square" alt="Version">
  </a>
  <a href="https://npmjs.com/package/marchio-datastore">
    <img src="https://img.shields.io/github/license/mitchallen/marchio-datastore.svg" alt="License"></a>
  </a>
</p>

## Installation

As main app:

    $ npm init
    $ npm install marchio-datastore --save
    
As marchio child app:

    $ npm init
    $ npm install marchio --save
    $ npm install marchio-datastore --save
  
* * *

## Modules

<dl>
<dt><a href="#module_marchio-datastore">marchio-datastore</a></dt>
<dd><p>Module</p>
</dd>
<dt><a href="#module_marchio-datastore-factory">marchio-datastore-factory</a></dt>
<dd><p>Factory module</p>
</dd>
<dt><a href="#module_marchio-datastore-ERROR">marchio-datastore-ERROR</a></dt>
<dd><p>Error module</p>
</dd>
</dl>

<a name="module_marchio-datastore"></a>

## marchio-datastore
Module

<a name="module_marchio-datastore-factory"></a>

## marchio-datastore-factory
Factory module

<a name="module_marchio-datastore-factory.create"></a>

### marchio-datastore-factory.create(spec) ⇒ <code>Promise</code>
Factory method 
It takes one spec parameter that must be an object with named parameters

**Kind**: static method of <code>[marchio-datastore-factory](#module_marchio-datastore-factory)</code>  
**Returns**: <code>Promise</code> - that resolves to an expressjs app  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Named parameters object |
| [spec.path] | <code>String</code> | Base path (like "/api" or "/v1") |
| [spec.post] | <code>boolean</code> | Allow HTTP POST |
| [spec.get] | <code>boolean</code> | Allow HTTP GET |
| [spec.put] | <code>boolean</code> | Allow HTTP PUT |
| [spec.del] | <code>boolean</code> | Allow HTTP DELETE |
| [spec.patch] | <code>boolean</code> | Allow HTTP PATCH |

**Example** *(Environment setup)*  
```js
$ export MARCHIO_GOOGLE_PROJECT_ID='my-project-id'
$ export MARCHIO_PORT=8080
```
**Example** *(Child app of marchio example)*  
```js
"use strict";
 
var factory = require("marchio"),
    datastore = require('marchio-datastore');
 
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
```
**Example** *(curl testing)*  
```js
$ curl -i -X POST -H "Content-Type: application/json" \
    -d '{"email":"test@demo.com"}' http://localhost:8080/user

$ curl -i -X GET -H "Accept: applications/json" \
    http://localhost:8080/user/1234567890123456

$ curl -i -X PUT -H "Content-Type: application/json" \
    -d '{"email":"test@demo.com", "status":"UPDATED"}' \
    http://localhost:8080/user/1234567890123456

$ curl -i -X PATCH -H "Content-Type: application/json" \
    -d '[{"op":"replace","path":"/status","value":"PATCH"}]' \
    http://localhost:8080/user/1234567890123456

$ curl -i -X DELETE -H "Content-Type: application/json" \
    http://localhost:8080/user/1234567890123456
```
**Example** *(Main app example)*  
```js
var factory = require("marchio-datastore");

const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;

var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" },
        password: { type: String, select: false },  // select: false, exclude from query results
    }
};

factory.create({
    model: _testModel,
    projectId: GOOGLE_PROJECT_ID,
    post: true,
    get: true,
    put: true,
    del: true,
    patch: true
})
.then(function(app) {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);   
    });
})
.catch( function(err) { 
    console.error(err); 
});
```
**Example** *(Path based example)*  
```js
var factory = require("marchio-datastore");

const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;

var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" },
        password: { type: String, select: false },  // select: false, exclude from query results
    }
};

factory.create({
    model: _testModel,
    projectId: GOOGLE_PROJECT_ID,
    path: '/api',
    post: true,
    get: true,
    put: true,
    del: true,
    patch: true
})
.then(function(app) {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);   
    });
})
.catch( function(err) { 
    console.error(err); 
});
```
**Example** *(path-based curl testing)*  
```js
$ curl -i -X POST -H "Content-Type: application/json" \
    -d '{"email":"test@demo.com"}' http://localhost:8080/api/user

$ curl -i -X GET -H "Accept: applications/json" \
    http://localhost:8080/api/user/1234567890123456

$ curl -i -X PUT -H "Content-Type: application/json" \
    -d '{"email":"test@demo.com", "status":"UPDATED"}' \
    http://localhost:8080/api/user/1234567890123456

$ curl -i -X PATCH -H "Content-Type: application/json" \
    -d '[{"op":"replace","path":"/status","value":"PATCH"}]' \
    http://localhost:8080/api/user/1234567890123456

$ curl -i -X DELETE -H "Content-Type: application/json" \
    http://localhost:8080/api/user/1234567890123456
```
<a name="module_marchio-datastore-ERROR"></a>

## marchio-datastore-ERROR
Error module


| Param | Type | Description |
| --- | --- | --- |
| ```MODEL_MUST_BE_DEFINED``` | <code>string</code> | datastore.create: model must be defined |
| ```MODEL_NAME_MUST_BE_DEFINED``` | <code>string</code> | datastore.create: model.name must be defined |
| ```PROJECT_ID_MUST_BE_DEFINED``` | <code>string</code> | datastore.create: projectId must be defined |
| ```NO_HTTP_METHODS_ENABLED``` | <code>string</code> | datastore.create: No HTTP methods enabled |

**Example** *(Usage example)*  
```js
 .catch( (err) => {
    if( err.message == _factory.ERROR.MODEL_MUST_BE_DEFINED ) {
        ...
    }
}
```

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/marchio-datastore.git](https://bitbucket.org/mitchallen/marchio-datastore.git)
* [github.com/mitchallen/marchio-datastore.git](https://github.com/mitchallen/marchio-datastore.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.20

* HTTP DELETE now returns a status of 204 instead of 200 because it doesn't return a response body.

#### Version 0.1.19

* The __numeric__ flag is ignored since post always auto-generates numeric keys

#### Version 0.1.18

* Updated to use latest marchio-core-app

#### Version 0.1.17

* Now uses external marchio-core-record

#### Version 0.1.16

* Updated marchio-core-app to version 0.1.3

#### Version 0.1.15

* Now uses external marchio-core-app

#### Version 0.1.14

* Added path parameter to create method ('/api', '/v1', etc.)

#### Version 0.1.13

* Added a Google Cloud Function example

#### Version 0.1.12

* Implemented preprocess setting on microservice cores
* Added preprocess password encryption example

#### Version 0.1.11

* Microservice cores now use app instead of router

#### Version 0.1.10

* Moved non-datastore functionality out of datastore-core

#### Version 0.1.9

* Refactored code to use router.param instead of custom callback

#### Version 0.1.8

* Refactored code
* Moved model / id validation to core

#### Version 0.1.7

* HTTP PATCH now uses transaction for better record integrity
* Fixed issue where PUT was saving on datastore and not transaction

#### Version 0.1.6

* HTTP PUT can now handle partial updates
* Behind the scenes PUT now use a transaction to ensure record integrity

#### Version 0.1.5

* Added HTTP PATCH support
* Added new test cases for HTTP PATCH

#### Version 0.1.4

* Added HTTP DELETE support
* Improved GET and PUT handling for invalid ids
* Added and updated test cases

#### Version 0.1.3

* Added PUT support

#### Version 0.1.2

* Fixed some doc issues

#### Version 0.1.1

* Now must specify what HTTP methods to allow in create method.

#### Version 0.1.0 

* initial release

* * *
