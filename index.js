//TODO: change this to a constructor

function init(db, options){
  if (!options || !options.dataType){
    throw new Error('zefti-redis-interface error, no dataType provided.')
  }
  if (!redis[options.dataType]){
    throw new Error('zefti-redis-interface error, type not available: ' + options.dataType);
  }
  return new redis[options.dataType](db);
}

var redis = {};

/*
 * Hash redis dataType
 */

redis.hash = function(db){
  this.db = db;
  return this;
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
  });
}

redis.hash.prototype.find = function(hash, fieldMask, options, cb){

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

redis.hash.prototype.update = function(hash, update, options, cb){

}

redis.hash.prototype.updateById = function(id, update, options, cb){

}

redis.hash.prototype.remove = function(hash, update, options, cb){

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

redis.hash.prototype.removeFields = function(hash, update, options, cb){

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

redis.hash.prototype.addToSet = function(hash, update, options, cb){

}

redis.hash.prototype.addToSetById = function(id, update, options, cb){

}

redis.hash.prototype.removeFromSet = function(hash, update, options, cb){

}

redis.hash.prototype.removeFromSetById = function(id, update, options, cb){

}

redis.hash.prototype.expire = function(hash, options, cb){

}

redis.hash.prototype.expireById = function(id, options, cb){

}

redis.hash.prototype.getNewId = function(options){

}



/*
 * String redis dataType
 */

redis.string = function(db){
  this.db = db;
  return this;
}

redis.string.prototype.create = function(hash, options, cb){

}

redis.string.prototype.find = function(hash, fieldMask, options, cb){

}

redis.string.prototype.findById = function(id, fieldMask, options, cb){

}
redis.string.prototype.upsert = function(hash, update, options, cb){

}

redis.string.prototype.update = function(hash, update, options, cb){

}

redis.string.prototype.updateById = function(id, update, options, cb){

}

redis.string.prototype.remove = function(hash, options, cb){

}

redis.string.prototype.removeById = function(id, options, cb){

}

redis.string.prototype.removeFields = function(hash, update, options, cb){

}

redis.string.prototype.removeFieldsById = function(id, fields, options, cb){

}

redis.string.prototype.addToSet = function(hash, update, options, cb){

}

redis.string.prototype.addToSetById = function(id, update, options, cb){

}

redis.string.prototype.removeFromSet = function(hash, update, options, cb){

}

redis.string.prototype.removeFromSetById = function(id, update, options, cb){

}

redis.string.prototype.expire = function(hash, options, cb){

}

redis.string.prototype.expireById = function(id, options, cb){

}

redis.string.prototype.getNewId = function(options){

}

/*
 * Set redis dataType
 */

redis.set = function(db){
  this.db = db;
  return this;
}

redis.set.prototype.create = function(hash, options, cb){

}

redis.set.prototype.find = function(hash, fieldMask, options, cb){

}

redis.set.prototype.findById = function(id, fieldMask, options, cb){

}
redis.set.prototype.upsert = function(hash, update, options, cb){

}

redis.set.prototype.update = function(hash, update, options, cb){

}

redis.set.prototype.updateById = function(id, update, options, cb){

}

redis.set.prototype.remove = function(hash, options, cb){

}

redis.set.prototype.removeById = function(id, options, cb){

}

redis.set.prototype.removeFields = function(hash, update, options, cb){

}

redis.set.prototype.removeFieldsById = function(id, fields, options, cb){

}

redis.set.prototype.addToSet = function(hash, update, options, cb){

}

redis.set.prototype.addToSetById = function(id, update, options, cb){

}

redis.set.prototype.removeFromSet = function(hash, update, options, cb){

}

redis.set.prototype.removeFromSetById = function(id, update, options, cb){

}

redis.set.prototype.expire = function(hash, options, cb){

}

redis.set.prototype.expireById = function(id, options, cb){

}

redis.set.prototype.getNewId = function(options){

}




redis.pubsub = function(db){
  this.db = db;
  return this;
};

redis.pubsub.prototype.create = function(hash, options, cb){
  this.db.publish('alive', hash, function(err, response){
    console.log('publish err::');
    console.log(err);
    console.log('publish response::');
    console.log(response);
  });
};

redis.pubsub.prototype.find = function(hash, fieldMask, options, cb){

};



module.exports = init;