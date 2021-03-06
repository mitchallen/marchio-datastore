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
