// var factory = require("marchio-datastore");
var factory = require("../../modules/index");

const GOOGLE_PROJECT_ID = process.env.MARCHIO_GOOGLE_PROJECT_ID,
      PORT = process.env.MARCHIO_PORT || 8080;

var _testModel = {
    name: 'user',
    fields: {
        email:    { type: String, required: true },
        status:   { type: String, required: true, default: "NEW" },
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