## Modules

<dl>
<dt><a href="#module_marchio-datastore">marchio-datastore</a></dt>
<dd><p>Module</p>
</dd>
<dt><a href="#module_marchio-datastore-factory">marchio-datastore-factory</a></dt>
<dd><p>Factory module</p>
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

**Example** *(Usage example)*  
```js
    var factory = require("marchio-datastore");
 
    factory.create({})
    .then(function(obj) {
        return obj.health();
    })
    .catch( function(err) { 
        console.error(err); 
    });
```
