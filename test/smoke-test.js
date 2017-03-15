/**
    Module: marchio-datastore
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint mocha: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = "../modules/index",
    GOOGLE_TEST_PROJECT = process.env.MARCHIO_TEST_GOOGLE_PROJECT,
    TEST_PORT = process.env.MARCHIO_PORT || 8080;

describe('module factory smoke test', () => {

    var _factory = null;

    var _testModel = {
        name: 'smoketest',
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    }

    before( done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after( done => {
        // Call after all tests
        done();
    });

    beforeEach( done => {
        // Call before each test
        done();
    });

    afterEach( done => {
        // Call after eeach test
        done();
    });

    it('module should exist', done => {
        should.exist(_factory);
        done();
    });

    it('create method with no spec should be rejected', done => {
        _factory.create()
        .catch( function(err) { 
            // We are expecting this error
            // console.error(err.message); 
            err.message.should.eql(_factory.ERROR.MODEL_MUST_BE_DEFINED)
            done();  // to pass on err, remove err (done() - no arguments)
        }).catch( function(err) { 
            // We are NOT expecting this error
            // console.error(err.message); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with no http route enabled should be rejected', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel
        })
        // Need dual catch incase should eql fails
        .catch( function(err) { 
            // We are expecting this error
            // console.error(err.message); 
            err.message.should.eql(_factory.ERROR.NO_HTTP_METHODS_ENABLED);
            done();  // to pass on err, remove err (done() - no arguments)
        })
        .catch( function(err) { 
            // We are NOT expecting this error
            // console.error(err.message); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with post set to true should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with post set to false should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: false
        })
        // Need dual catch incase should eql fails
        .catch( function(err) { 
            // We are expecting this error
            // console.error(err.message); 
            err.message.should.eql(_factory.ERROR.NO_HTTP_METHODS_ENABLED);
            done();  // to pass on err, remove err (done() - no arguments)
        })
        .catch( function(err) { 
            // We are NOT expecting this error
            // console.error(err.message); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with get set to true should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            get: true
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with get set to false should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            get: false
        })
        // Need dual catch incase should eql fails
        .catch( function(err) { 
            // We are expecting this error
            // console.error(err.message); 
            err.message.should.eql(_factory.ERROR.NO_HTTP_METHODS_ENABLED);
            done();  // to pass on err, remove err (done() - no arguments)
        })
        .catch( function(err) { 
            // We are NOT expecting this error
            // console.error(err.message); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with post and get set to true should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true,
            get: true
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with post set to true and get set to false should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true,
            get: false
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with post set to false and get set to true should return object', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: false,
            get: true
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });
});
