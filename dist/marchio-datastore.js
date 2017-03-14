(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.MitchAllen || (g.MitchAllen = {})).MarchioDatastore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
    Module: marchio-datastore
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

/**
 * Module
 * @module marchio-datastore
 */

/**
 * 
 * Factory module
 * @module marchio-datastore-factory
 */

/** 
* Factory method 
* It takes one spec parameter that must be an object with named parameters
* @param {Object} spec Named parameters object
* @returns {Promise} that resolves to {module:marchio-datastore}
* @example <caption>Usage example</caption>
   var factory = require("marchio-datastore");

   factory.create({})
   .then(function(obj) {
       return obj.health();
   })
   .catch( function(err) { 
       console.error(err); 
   });
*/

module.exports.create = function (spec) {

    return new Promise(function (resolve, reject) {

        spec = spec || {};

        // reject("reason");

        // private 
        var _package2 = "marchio-datastore";

        resolve({
            // public
            /** Returns the package name
              * @function
              * @instance
              * @memberof module:marchio-datastore
            */
            package: function _package() {
                return _package2;
            },
            /** Health check
              * @function
              * @instance
              * @memberof module:marchio-datastore
              * @example <caption>Usage Example</caption>
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
            */
            health: function health() {
                return new Promise(function (resolve, reject) {
                    resolve("OK");
                });
            }
        });
    });
};

},{}]},{},[1])(1)
});