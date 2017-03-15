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
    killable = require('killable'),
    modulePath = "../modules/index",
    GOOGLE_TEST_PROJECT = process.env.MARCHIO_GOOGLE_PROJECT_ID,
    TEST_PORT = process.env.MARCHIO_PORT || 8080;

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

describe('module factory smoke test', () => {

    var _factory = null;

    var _server = null;

    var _testModel = {
        name: 'datastore-test',
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    };

    var _testHost = `http://localhost:${TEST_PORT}`;
    var _postUrl = `/${_testModel.name}`;

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
        _server = null;
        done();
    });

    afterEach( done => {
        // Call after each test
        if( _server ) {
            _server.close();
            _server.kill(() => {});
            _server = null;
        }

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

    it('post should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true
        })
        .then(function(app) {
           _server = app.listen(TEST_PORT, () => {
               // console.log(`listening on port ${TEST_PORT}`);   
           });
           killable(_server);
           return Promise.resolve(true);
        })
        .then( () => {

            var testObject = {
                email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
            };

            // console.log(`TEST HOST: ${_testHost} `);

            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    // // Should not return password
                    // should.not.exist(res.body.password);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    done();;
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('get should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true
        })
        .then(function(app) {
           _server = app.listen(TEST_PORT, () => {
               // console.log(`listening on port ${TEST_PORT}`);   
           });
           killable(_server);
           return Promise.resolve(true);
        })
        .then( () => {

            var testObject = {
                email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // GET
                    var _recordId = res.body._id; 
                    var _getUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log("GET URL: ", _getUrl);
                    request(_testHost)
                        .get(_getUrl)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            // console.log(res.body);
                            res.body.email.should.eql(testObject.email);
                            // // Should not return password
                            // should.not.exist(res.body.password);
                            res.body.status.should.eql("NEW");
                            should.exist(res.body._id);
                            done();;
                        });
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('put should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            post: true,
            get: true,
            put: true
        })
        .then(function(app) {
           _server = app.listen(TEST_PORT, () => {
               // console.log(`listening on port ${TEST_PORT}`);   
           });
           killable(_server);
           return Promise.resolve(true);
        })
        .then( () => {

            var testObject = {
                email: "testput" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // SETUP - need to post at least one record
            request(_testHost)
                .post(_postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.email.should.eql(testObject.email);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // GET
                    var _recordId = res.body._id; 
                    var _putUrl = `/${_testModel.name}/${_recordId}`;
                    // console.log("PUT URL: ", _putUrl);
                    request(_testHost)
                        .put(_putUrl)
                        .send({ email: testObject.email, status: "UPDATED" })
                        // .send({ status: "UPDATED" })
                        .set('Content-Type', 'application/json')
                        .expect(204)    // No content returned
                        .end(function (err, res) {
                            should.not.exist(err);
                            // No content, nothing to verify
                            var _getUrl = `/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log("RECORD: ", res.body);
                                    res.body.email.should.eql(testObject.email);
                                    // // Should not return password
                                    // should.not.exist(res.body.password);
                                    res.body.status.should.eql("UPDATED");
                                    should.exist(res.body._id);
                                    done();;
                                });
                        });
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });
});
