zefti-redis-interface
=====================

Standard Database Interface (inspired by mongo syntax)

Initalize
=========
var redis = require("redis")
var client = redis.createClient();
var ZeftiRedisInterface = require('zefti-redis-interface');
var myDataSource = new ZeftiRedisInterface({type:hash, db:client});

Usage
=====
myDataSource.findOne({key:1234}, function(err, result){

}

myDataSource.create({