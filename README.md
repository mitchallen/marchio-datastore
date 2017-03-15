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

    $ npm init
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
**Returns**: <code>Promise</code> - that resolves to {module:marchio-datastore}  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Named parameters object |
| spec.post | <code>boolean</code> | Allow HTTP POST |
| spec.get | <code>boolean</code> | Allow HTTP GET |
| spec.put | <code>boolean</code> | Allow HTTP PUT (Feature Not Implemented Yet) |
| spec.patch | <code>boolean</code> | Allow HTTP PATCH (Feature Not Implemented Yet) |
| spec.del | <code>boolean</code> | Allow HTTP DELETE (Feature Not Implemented Yet) |

**Example** *(Usage example)*  
```js
var factory = require("marchio-datastore");

const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;

var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" }
    }
};

factory.create({
    model: _testModel,
    projectId: GOOGLE_PROJECT_ID
    post: true,
    get: true
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

#### Version 0.1.1

* Now must specify what HTTP methods to allow in create method.

#### Version 0.1.0 

* initial release

* * *
