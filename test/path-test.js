/**
    Module: marchio-datastore
      Test: path-test
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

describe('path based', () => {

    var _factory = null;

    var _server = null;

    let _path = '/api';

    let _modelName = 'datastore-test';

    var _testModel = {
        name: _modelName,
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // In a real world example, password would be hashed by middleware before being saved
            password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    };

    var _hashPassword = function( req, res, next ) {
        console.log(req.body);
        // if req.body, if req.body.password
        // req.body.password = "zorro";
        next();
    }

    var _testHost = `http://localhost:${TEST_PORT}`;
    var _postUrl = `${_path}/${_testModel.name}`;

    before( done => {
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
            // console.log("killing server");
            _server.kill(() => {});
        }

        _server = null;

        done();
    });


    it('post should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                password: "fubar"
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
                    should.not.exist(res.body.password);
                    res.body.status.should.eql("NEW");
                    should.exist(res.body._id);
                    // console.log('Location:', res.header['location'] );
                    res.header['location'].should.eql(`${_path}/${_modelName}/${res.body._id}`);
                    done();
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('post with invalid model name in url should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            var _invalidPostUrl = `${_path}/bogus`;

            request(_testHost)
                .post(_invalidPostUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(404)
                .end(function (err, res) {
                    done();
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
            path: _path,
            post: true,
            get:  true
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
                password: "fubar"
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
                    var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
                    // console.log("GET URL: ", _getUrl);
                    request(_testHost)
                        .get(_getUrl)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            // console.log(res.body);
                            res.body.email.should.eql(testObject.email);
                            // // Should not return password
                            should.not.exist(res.body.password);
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

    it('get for a non-existent id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get:  true
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
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // GET
            var _recordId = '12345678'; 
            var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    // console.log(res.body);
                    done();;
                });


        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('get for a non-numeric id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get:  true
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
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // GET
            var _recordId = 'BOGUS'; 
            var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    // console.log(res.body);
                    res.body.error.should.containEql('not a valid id');
                    done();;
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
            path: _path,
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
                password: "fubar"
            };

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
                    // PUT
                    var _recordId = res.body._id; 
                    var _putUrl = `${_path}/${_testModel.name}/${_recordId}`;
                    // console.log("PUT URL: ", _putUrl);
                    request(_testHost)
                        .put(_putUrl)
                        // PROBLEM: hashed password is not included and Datastore doesn't do partial updates
                        .send({ email: testObject.email, status: "UPDATED" })
                        // .send({ status: "UPDATED" })
                        .set('Content-Type', 'application/json')
                        .expect(204)    // No content returned
                        .end(function (err, res) {
                            should.not.exist(err);
                            // console.log('Location:', res.header['location'] );
                            res.header['location'].should.eql(`${_path}/${_modelName}/${_recordId}`);
                            // No content, nothing to verify
                            var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                // Get ALL fields, verify password intact.
                                .query( { fields: 'email password status'} )
                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log("RECORD: ", res.body);
                                    res.body.email.should.eql(testObject.email);
                                    // Should return password based on fields query
                                    should.exist(res.body.password);
                                    // In production the password would be hashed and would not match
                                    res.body.password.should.eql(testObject.password);
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

    it('put for non-existent id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                password: "fubar"
            };

            // PUT
            var _recordId = '123456'; 
            var _putUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("PUT URL: ", _putUrl);
            request(_testHost)
                .put(_putUrl)
                .send({ email: testObject.email, status: "UPDATED" })
                // .send({ status: "UPDATED" })
                .set('Content-Type', 'application/json')
                .expect(404)    // No content returned
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('put for non-numeric id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                password: "fubar"
            };

            // PUT
            var _recordId = 'BOGUS'; 
            var _putUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("PUT URL: ", _putUrl);
            request(_testHost)
                .put(_putUrl)
                .send({ email: testObject.email, status: "UPDATED" })
                // .send({ status: "UPDATED" })
                .set('Content-Type', 'application/json')
                .expect(404)    // No content returned
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('delete should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get:  true,
            del: true
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
                password: "fubar"
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
                    // DELETE
                    var _recordId = res.body._id; 
                    var _delUrl = `${_path}/${_testModel.name}/${_recordId}`;
                    // console.log("DEL URL: ", _delUrl);
                    request(_testHost)
                        .del(_delUrl)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            // GET (make sure it's gone - expect 404)
                            var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                .expect(404)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log(res.body);
                                    res.body.error.should.containEql('not found');
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

    it('delete for a non-existent id should return 200', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get:  true,
            del: true
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
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // DELETE
            var _recordId = '12345678'; 
            var _delUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("DEL URL: ", _delUrl);
            request(_testHost)
                .del(_delUrl)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
   

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('delete for a non-numeric id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get:  true,
            del: true
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
                password: "fubar"
            };

            // console.log(`TEST HOST: ${_testHost} `);

            // DELETE
            var _recordId = 'BOGUS'; 
            var _delUrl = `${_path}/${_testModel.name}/${_recordId}`;
            // console.log("DEL URL: ", _delUrl);
            request(_testHost)
                .del(_delUrl)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('patch should succeed', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
            post: true,
            get: true,
            patch: true
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
                email: "testpatch" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                password: "fubar"
            };

            var patchStatus = "UPDATED PATCH STATUS",
                testPatch = [
                    // { "op": "remove", "path": "/password" }
                    {"op": "replace", "path": "/status", "value": patchStatus }
                ];

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
                    // PATCH
                    var _recordId = res.body._id; 
                    var _patchUrl = `${_path}/${_testModel.name}/${_recordId}`;
                    // console.log("PATCH URL: ", _patchUrl);
                    request(_testHost)
                        .patch(_patchUrl)
                        .send( testPatch )
                        .set('Content-Type', 'application/json')
                        .expect(204)  
                        .end(function (err, res) {
                            should.not.exist(err);
                            // console.log('Location:', res.header['location'] );
                            res.header['location'].should.eql(`${_path}/${_modelName}/${_recordId}`);
                            // GET
                            var _getUrl = `${_path}/${_testModel.name}/${_recordId}`;
                            // console.log("GET URL: ", _getUrl);
                            request(_testHost)
                                .get(_getUrl)
                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    // console.log("RECORD: ", res.body);
                                    res.body.email.should.eql(testObject.email);
                                    // // Should not return password
                                    should.not.exist(res.body.password);
                                    res.body.status.should.eql(patchStatus);
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

    it('patch for non-existent id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                email: "testpatch" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                password: "fubar"
            };

            var patchStatus = "UPDATED PATCH STATUS",
                testPatch = [
                    // { "op": "remove", "path": "/password" }
                    {"op": "replace", "path": "/status", "value": patchStatus }
                ];

            // PATCH
            var _recordId = '123456'; 
            var _patchUrl = `${_path}/${_testModel.name}/${_recordId}`;
            request(_testHost)
                .patch(_patchUrl)
                .send( testPatch )
                .set('Content-Type', 'application/json')
                .expect(404)   
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('patch for non-numeric id should return 404', done => {
        _factory.create({
            projectId: GOOGLE_TEST_PROJECT,
            model: _testModel,
            path: _path,
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
                password: "fubar"
            };

            var patchStatus = "UPDATED PATCH STATUS",
            testPatch = [
                // { "op": "remove", "path": "/password" }
                {"op": "replace", "path": "/status", "value": patchStatus }
            ];

            // PATCH
            var _recordId = 'BOGUS'; 
            var _patchUrl = `${_path}/${_testModel.name}/${_recordId}`;
            request(_testHost)
                .patch(_patchUrl)
                .send(testPatch)
                .set('Content-Type', 'application/json')
                .expect(404)   
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });

        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });
});
