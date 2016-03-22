"use strict";

const Memcached = require("memcached"),
    Q = require("q");

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
     * @todo Описать метод PUT /memcached/:key {"value":"baz","expires":90}, чтобы он менял данные в memcached по указанному ключу
     * @param next
     */
    putAction: function * (next){

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

    }
};