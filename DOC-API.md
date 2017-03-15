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


* [marchio-datastore-ERROR](#module_marchio-datastore-ERROR)
    * [.MODEL_MUST_BE_DEFINED](#module_marchio-datastore-ERROR+MODEL_MUST_BE_DEFINED)
    * [.MODEL_NAME_MUST_BE_DEFINED](#module_marchio-datastore-ERROR+MODEL_NAME_MUST_BE_DEFINED)

<a name="module_marchio-datastore-ERROR+MODEL_MUST_BE_DEFINED"></a>

### marchio-datastore-ERROR.MODEL_MUST_BE_DEFINED
Model definition error

**Kind**: instance property of <code>[marchio-datastore-ERROR](#module_marchio-datastore-ERROR)</code>  
<a name="module_marchio-datastore-ERROR+MODEL_NAME_MUST_BE_DEFINED"></a>

### marchio-datastore-ERROR.MODEL_NAME_MUST_BE_DEFINED
Model name definition error

**Kind**: instance property of <code>[marchio-datastore-ERROR](#module_marchio-datastore-ERROR)</code>  
