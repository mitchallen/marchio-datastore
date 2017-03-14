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


* [marchio-datastore](#module_marchio-datastore)
    * [.package()](#module_marchio-datastore+package)
    * [.health()](#module_marchio-datastore+health)

<a name="module_marchio-datastore+package"></a>

### marchio-datastore.package()
Returns the package name

**Kind**: instance method of <code>[marchio-datastore](#module_marchio-datastore)</code>  
<a name="module_marchio-datastore+health"></a>

### marchio-datastore.health()
Health check

**Kind**: instance method of <code>[marchio-datastore](#module_marchio-datastore)</code>  
**Example** *(Usage Example)*  
```js
                var factory = require("marchio-datastore");
             
                factory.create({})
                .then(function(obj) {
                    return obj.health();
                })
                .then(function(result) {
                    console.log("HEALTH: ", result);
                })
                .catch( function(err) { 
                    console.error(err); 
                });
```
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
