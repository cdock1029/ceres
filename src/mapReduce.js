var responseHandlers = require('./responseHandlers'),
  Code = require('mongodb').Code,
  MongoClient = require('mongodb').MongoClient;

var countRangeReduce = function(key, val) {
  return Array.sum(val);
}

function createTimeFunc(startTime, endTime) {
  var timeFn = null; 
  if (startTime !== null && endTime !== null) {
    timeFn = function() {
      return (this.server_utc > start && this.server_utc < end);
    }
  } else if (startTime !== null) {
    timeFn = function() {
      return (this.server_utc > start);
    }
  } else if (endTime !== null) {
    timeFn = function() {
      return (this.server_utc < end);
    }
  }  
  return timeFn;
}

function createMapFunc(key, val, timeFunc) {
  var str = "function() {";
  var keyStr = "this." + key;
  if (timeFunc !== null) {
    str = str + "if (timeFunc) {"
  }
  str = str + "try {";
  if (val) {
    var valStr = "this." + val;
    str = str + "emit(" + keyStr + ", " + valStr + ");";
  } else {
    str = str + "emit(" + keyStr + ", 1);";
  }
  str = str + "} catch(err) {}"
  if (timeFunc !== null) {
    str = str + "}";
  }
  str = str + "}";
  return str;
}

function countRange(key, val, timeFunc, response) {
  var o = {};
  o.scope = {};
  if (timeFunc !== null) {
    console.log('time functino not null!!');
    o.scope.timeFunc = timeFunc;
  }  
  //o.out = {replace: output}; 
  o.out = {inline: 1}; 
  var mapString = createMapFunc(key, val, timeFunc);
  var mapFunc = new Code(mapString);
  //connecting to the database
  MongoClient.connect(mongoConfig.uri, function(err,db) { 
    if(err) { 
      console.log(err);
      responseHandlers.invalidRequest(response, 2);
    } else {
      db.collection(mongoConfig.collection, function(err, collection) {
        if(err) {
          console.log(err);
          responseHandlers.invalidRequest(response, 2);
        } else {
          collection.mapReduce(mapFunc, countRangeReduce, o, function(err, result) {
            db.close();
            if(err) {
              console.log(err);
              responseHandlers.invalidRequest(response, 2);
            } else {
              console.log("size of result: " + result.length);
              responseHandlers.validRequest(response, true, result);
            }
          });
        }
      });
    }
  }); 
}   

function metric(subtype, startTime, endTime, key, val, response) {
  // main entry point for metrics. Branch to functions based on subtype, and rest of params.
  timeFunc = createTimeFunc(startTime, endTime); 
  if (subtype === "countRange") {
    //console.log("subtype correct");
    countRange(key, val, timeFunc, response);
  } else {
    //console.log("subtype WRONG");
    responseHandlers.invalidRequest(response, 2);
  }

  
}

exports.metric = metric;
