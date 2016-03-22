module.exports = function routes(app) {
    "use strict";

    var Router = require('koa-router');
    var router = new Router();

    router
        .get('/users', require('../controllers/indexController').list)
        .get('/users/:id', require('../controllers/indexController').getId)
        .post('/users/', require('../controllers/indexController').createItem)
        .put('/users/:id', require('../controllers/indexController').updateItem)
        .delete('/users/:id', require('../controllers/indexController').removeItem)
        .post('/memcached', require("../controllers/MemcachedController").postAction)
        .get('/memcached/:key', require("../controllers/MemcachedController").getAction)
        .delete('/memcached/:key', require("../controllers/MemcachedController").deleteAction)
        .put('/memcached/:key', require("../controllers/MemcachedController").putAction)
    ;

    app.use(router.middleware());

};