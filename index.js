function init(options){
  if (!options || !options.type){
    throw new Error('zefti-redis-interface error, no type provided.')
  }
  if (!redis[options.type]){
    throw new Error('zefti-redis-interface error, type not available: ' + options.type);
  }
  return new redis[options.type](options.db);
}

var redis = {}

redis.hash = function(db){
  this.db = db;
  return this;
}

redis.hash.prototype.findById = function(id, fieldMask, options, cb){
  var redisCommand = 'hgetall';
  var redisCommandArr = [id]

  if (arguments.length === 4) {
    if (Object.keys(fieldMask).length > 0) {
      redisCommand = 'hmget';
      redisCommandArr.push(Object.keys(fieldMask));
    }
  }
  if (arguments.length === 3) {
    if (Object.keys(fieldMask).length > 0) {
      redisCommand = 'hmget';
      redisCommandArr.push(Object.keys(fieldMask));
    }
    var cb = options;
  }
  if (arguments.length === 2) {
    var cb = fieldMask;
  }
  if (arguments.length === 1) {
    var cb = function(err, result){};
  }


  var redisCallback = function(err, result){
    var resultObj = {};
    if (result instanceof Array) {
      Object.keys(fieldMask).forEach(function(field, index){
        if (result[index]) resultObj[field] = result[index];
      })
    } else {
      resultObj = result;
    }
    cb (err, resultObj);
  }

  redisCommandArr.push(redisCallback);
  this.db[redisCommand].apply(this.db, redisCommandArr);
}

redis.hash.prototype.create = function(hash, options, cb){
  var self = this;
  if (!hash.id || hash._id) return cb('id must be provided', null);
  var id = hash.id || hash._id;
  delete hash.id;
  delete hash._id;
  if (arguments.length === 2) {
    var cb = options;
  }
  if (arguments.length === 1) {
    var cb = function(err, result){};
  }
  self.db.exists(id, function(err, result){
    if (result) return cb('id already exists', null);
    self.db.hmset(id, hash, cb);
  })

}

redis.hash.prototype.upsert = function(hash, options, cb){
  if (!hash.id || hash._id) return cb('id must be provided', null);
  var id = hash.id || hash._id;
  delete hash.id;
  delete hash._id;
  if (arguments.length === 2) {
    var cb = options;
  }
  if (arguments.length === 1) {
    var cb = function(err, result){};
  }
  this.db.hmset(id, hash, cb);
}

redis.hash.prototype.removeById = function(id, options, cb){
  if (arguments.length === 2) {
    var cb = options;
  }
  if (arguments.length === 1) {
    var cb = function(err, result){};
  }
  this.db.del(id, cb);
}

redis.hash.prototype.removeFieldsById = function(id, fieldMask, options, cb){
  if (arguments.length === 3) {
    if (Object.keys(fieldMask).length > 0) {
      redisCommand = 'hmget';
      redisCommandArr.push(Object.keys(fieldMask));
    }
    var cb = options;
  }
  if (arguments.length === 2) {
    var cb = options;
  }
  if (arguments.length === 1) {
    var cb = function(err, result){};
  }
  this.db.del(id, cb);
}


redis.string = function(db){
  this.db = db;
  return this;
}



module.exports = init;