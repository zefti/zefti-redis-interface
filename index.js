var msgpack = require('msgpack-js');
var utils = require('zefti-utils');
var resolve5Arguments = utils.resolve5Arguments;
var resolve4Arguments = utils.resolve4Arguments;
var resolve3Arguments = utils.resolve3Arguments;
var errors = require('./lib/errors.json');
var errorHandler = require('zefti-error-handler');
errorHandler.addErrors(errors);

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
};

redis.hash.prototype.create = function(){
  var intArgs = resolve3Arguments(arguments);
  var hash = intArgs[0];
  var cb = intArgs[2];
  var self = this;
  if (!hash._id) return cb({errCode:'56b7295fffbc693838624fb7'});
  var id = hash._id;
  delete hash._id;
  self.db.exists(id, function(err, result){
    if (err) return cb({errCode:'56b7295fffbc693838624fb9', err:err});
    if (result) return cb({errCode:'56b7295fffbc693838624fb8'});
    self.db.hmset(id, hash, function(err, result){
      if (err) return cb({errCode:'56b7295fffbc693838624fba', err:err});
      if (!result) return cb({errCode:'56b7295fffbc693838624fbb', info:'returned result: ' + result});
      hash._id = id;
      cb(null, hash);
    });
  });
};

redis.hash.prototype.findById = redis.hash.prototype.find = function(){
  var intArgs = resolve4Arguments(arguments);
  var redisCommand = 'hgetall';
  var fieldMaskArr = [];
  if (Object.keys(intArgs[1]).length > 0) {
    redisCommand = 'hmget';
    for (var key in intArgs[1]){
      fieldMaskArr.push(key);
    }
  }
  var cb = intArgs.splice(3, 1)[0];

  var redisCallback = function(err, result){
    var resultObj = null;
    var resultType = utils.type(result);
    if (resultType === 'array') {
      resultObj = {_id : intArgs[0]};
      fieldMaskArr.forEach(function(field, index){
        if (result[index]) resultObj[field] = result[index];
      })
    } else if (resultType === 'object') {
      resultObj = result;
      resultObj._id = intArgs[0];
    } else {
      //do nothing, it isnt an array or object
    }
    cb (err, resultObj);
  };

  //splice out options
  intArgs.splice(2, 1);
  //splice out fieldmask if getting all
  if (redisCommand === 'hgetall') {
    intArgs.splice(1,1);
    //or change fieldMask to the array
  } else {
    intArgs[1] = fieldMaskArr;
  }
  intArgs.push(redisCallback);
  this.db[redisCommand].apply(this.db, intArgs);
};



redis.hash.prototype.upsert = function(){var self = this;
  var intArgs = resolve3Arguments(arguments);
  var hash = intArgs[0];
  var options = intArgs[1];
  var cb = intArgs[2];
  if (!hash._id) return cb({errCode:'56b7295fffbc693838624fbb'});
  var id = hash._id;
  delete hash._id;
  this.db.hmset(id, hash, function(err, result){
    if (err) return cb({errCode:'56b7295fffbc693838624fb9', info:'redis upsert hmset'});
    if (!result) return cb({errCode:'56b7295fffbc693838624fbc', info:'returned result: ' + result});
    if (options.result === false) return cb(null, 1);
    self.db.hgetall(id, function(err, result){
      if (err) return cb({errCode:'56b7295fffbc693838624fb9', info:'redis upsert hgetall'});
      result._id = id;
      return cb(null, result);
    });
  });
};

redis.hash.prototype.update = function(hash, update, options, cb){

}

redis.hash.prototype.updateById = function(id, update, options, cb){

}

redis.hash.prototype.remove = function(hash, update, options, cb){

};

redis.hash.prototype.removeAll = function(cb){
  this.db.flushall(function(err, result){
    return cb(err, result);
  });
};

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

};

redis.hash.prototype.count = function(cb){
  this.db.dbsize(function(err, result){
    return cb(err, result);
  });
};



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

redis.string.prototype.removeAll = function(cb){
  this.db.flushall(function(err, result){
    return cb(err, result);
  });
};

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

};

redis.set.prototype.removeAll = function(cb){
  this.db.flushall(function(err, result){
    return cb(err, result);
  });
};

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

redis.pubsub.prototype.subscribe = function(){
  var intArgs = resolve3Arguments(arguments);
  var channel = intArgs[0];
  var options = intArgs[1];
  var cb = intArgs[2];
  var pattern = options.pattern;
  this.db.subscribe(channel, function(err, result){
    cb(err, result);
  });
};

redis.pubsub.prototype.unsubscribe = function(){
  var intArgs = resolve3Arguments(arguments);
  var channel = intArgs[0];
  var options = intArgs[1];
  var cb = intArgs[2];
  var pattern = options.pattern;
  this.db.unsubscribe(channel, function(err, result){
    cb(err, result);
  });
};

redis.pubsub.prototype.publish = function(){
  var finalContent = null;
  var intArgs = resolve4Arguments(arguments);
  var channel = intArgs[0];
  var content = intArgs[1]
  var options = intArgs[2];
  var cb = intArgs[3];
  var encode = options.encode;
  if (encode){
    finalContent = msgpack.encode(content);
  } else {
    finalContent = content;
  }
  this.db.publish(channel, finalContent, function(err, result){
    cb(err, result);
  });
};



module.exports = init;