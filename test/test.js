var assert = require('assert');
var utils = require('zefti-utils');
var zeftiRedisInterface = require('zefti-redis-interface');
var zeftiTest = require('zefti-test');
var dependencies = zeftiTest.dependencies;

/* databases */
var redisHash = zeftiRedisInterface(dependencies.dataSources.hatchSession, {dataType:'hash'});

/* models */


/* controllers */


describe('REDIS - HASH', function() {
  var item1Id = '1234';
  var item2Id = '5678';
  var item3Id = '9012';
  var field1 = 'abc';
  var field1New = 'cba';
  var field2 = 'def';
  var field3 = 'ghi';


  before('clear all user data', function(done){
    redisHash.removeAll(function(err, result){
      assert(!err);
      redisHash.count(function(err, count){
        if (err) console.log(err);
        assert(!err);
        assert.equal(count, 0);
        done();
      });
    });
  });

  describe('create', function() {
    var returnedItem1 = null;

    it('should fail when creating with no id', function (done) {
      redisHash.create({foo:'bar'}, function(err, result){
        assert(err);
        assert.equal(err.errCode, '56b7295fffbc693838624fb7');
        done();
      });
    });

    it('should fail when only an id is provided', function (done) {
      redisHash.create({_id:item1Id}, function(err, result){
        assert(err);
        done();
      });
    });

    it('should create a new redis hash', function (done) {
      redisHash.create({_id:item1Id, field1:field1, field2:field2, field3:field3}, function(err, result){
        returnedItem1 = result;
        if (err) console.log(err);
        assert(!err);
        done();
      });
    });

    it('create should return the same item created', function (done) {
      assert.equal(returnedItem1._id, item1Id);
      done();
    });

    it('should create if key already exists', function (done) {
      redisHash.create({_id:item1Id, test:'true'}, function(err, result){
        assert(err);
        assert.equal(err.errCode, '56b7295fffbc693838624fb8');
        done();
      });
    });

  });

  describe('findById', function() {
    var foundItem1 = null;
    var foundItem2 = null;

    it('should find by key', function (done) {
      redisHash.findById(item1Id, function(err, result){
        assert(!err);
        assert(result);
        foundItem1 = result;
        done();
      });
    });

    it('should contain the _id in the result', function (done) {
      assert(foundItem1._id, item1Id);
      done();
    });

    it('should contain all the fields identified', function (done) {
      assert(foundItem1.field1, field1);
      assert(foundItem1.field2, field2);
      assert(foundItem1.field3, field3);
      assert(!foundItem1.field4);
      done();
    });

    it('should find with fieldmask', function (done) {
      redisHash.findById(item1Id, {field1:field1}, function(err, result){
        assert(!err);
        assert(result);
        foundItem2 = result;
        done();
      });
    });

    it('should contain only the id & field(s) identified in the fieldMask ', function (done) {
      assert(foundItem2._id, item1Id);
      assert(foundItem2.field1, field1);
      assert(!foundItem2.field2);
      assert(!foundItem2.field3);
      done();
    });

  });

  describe('upsert', function() {
    var foundItem1 = null;
    var foundItem2 = null;

    it('should successfully create a new redis hash', function (done) {
      redisHash.upsert({_id:item2Id, field1:field1, field2:field2}, function (err, result) {
        if (err) console.log(err);
        assert(!err);
        assert(result);
        foundItem1 = result;
        done();
      });
    });

    it('default should return back the upserted item', function (done) {
      assert.equal(foundItem1._id, item2Id);
      assert.equal(foundItem1.field1, field1);
      assert.equal(foundItem1.field2, field2);
      done();
    });

    it('should not return back the result if option is set to false', function (done) {
      redisHash.upsert({_id:item3Id, field1:field1, field2:field2}, {result:false}, function (err, result) {
        if (err) console.log(err);
        assert(!err);
        assert(result);
        assert.equal(result, 1);
        done();
      });
    });

    it('should successfully update an existing', function (done) {
      redisHash.upsert({_id:item2Id, field1:field1New}, function (err, result) {
        if (err) console.log(err);
        assert(!err);
        assert(result);
        foundItem2 = result;
        done();
      });
    });

    it('changed field should reflect new value', function (done) {
      assert.equal(foundItem2.field1, field1New);
      done();
    });

    it('existing field should retain existing value', function (done) {
      assert.equal(foundItem2.field2, field2);
      done();
    });

  });

});

describe('session', function() {


});



