"use strict";

const Memcached = require("memcached"),
    Q = require("q");

var co = require('co');
let client = new Memcached("127.0.0.1:11211");

module.exports = {

    /**
     * Достает из memcached данные по указанному ключу
     *
     * @example curl -v -X GET "http://127.0.0.1:8081/memcached/bar"
     * @param next
     */
    getAction: function * (next){
        this.body = yield Q.npost(client, "get", [this.params.key]);
    },

    /**
     * @example curl -v -X PUT "http://127.0.0.1:8081/memcached/bar" -d '{"value":"baz","expires":90}' -H "Content-Type: application/json"
     * @todo Описать метод PUT /memcached/:key {"value":"baz","expires":90}, чтобы он менял данные в memcached по указанному ключу
     * @param next
     */
    putAction: function * (next){
        let data={success:0},
            _client_replace = client.replace,
            key = this.params.key,
            value = this.request.body.value,
            expires = this.request.body.expires;

        yield co( function* () {

            let promice = yield new Promise( (resolve, reject) => {
                _client_replace.call(client, key, value, expires,(err, res) => {
                    if(err){
                        reject(err);
                    } else {
                        data.success=1;
                        resolve(res);
                    }
                });
            });

            return promice;
        }).then(function(result){
            console.log(result);
        }, function(error){
            data.error=error;
        });

        if(data.success){
            this.status = 201;
            this.body = 'save';
        } else {
            this.status = 400;
            this.body = 'bad request - '+data.error;
        }

        // вариант с Q
        //try{
        //    yield Q.npost(client, "replace", [this.params.key, this.request.body.value, this.request.body.expires]);
        //    this.status = 201;
        //    this.body = this.request.body;
        //}catch(e){
        //    this.status = 400;
        //    this.body = {message: "Bad Request"};
        //}

        yield next;
    },

    /**
     * Устанаваливает значение заданному ключу
     *
     * @example curl -v -X POST "http://127.0.0.1:8081/memcached" -d '{"key":"bar","value":"foo","expires":60}' -H "Content-Type: application/json"
     * @param next
     */
    postAction: function * (next){
        try{
            yield Q.npost(client, "set", [this.request.body.key, this.request.body.value, this.request.body.expires]);
            this.status = 201;
            this.body = this.request.body;
        }catch(e){
            this.status = 400;
            this.body = {message: "Bad Request"};
        }

        yield next;

    },

    /**
     *
     * @todo Описать метод DELETE /memcached/:key который удалял бы по ключу из memcached. Использовать другие методы преобразования функций для работы с memcached
     * @param next
     */
    deleteAction: function * (next){

        let data={success:0},
            _client_delete = client.delete,
            key = this.params.key;

        yield co( function* () {

            let promice = yield new Promise( (resolve, reject) => {
                _client_delete.call(client, key, (err, res) => {
                    if(err){
                        reject(err);
                    } else {
                        data.success=1;
                        resolve(res);
                    }
                });
            });

            return promice;
        }).then(function(result){
            console.log(result);
        }, function(error){
            data.error=error;
        });

        if(data.success){
            this.status = 201;
            this.body = 'delete';
        } else {
            this.status = 400;
            this.body = 'bad request - '+data.error;
        }

        yield next;

        // Q
        //this.body = yield Q.npost(client, "delete", [this.params.key]);
    }
};