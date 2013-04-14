var responseHandlers = require('./responseHandlers'),
  Code = require('mongodb').Code,
  MongoClient = require('mongodb').MongoClient;

function createTimeFunc(startTime, endTime) {
  var timeFn = null; 
  if (startTime !== null && endTime !== null) {
    timeFn = function(time, start, end) {
      return (time > start && time < end);
    }
  } else if (startTime !== null) {
    timeFn = function(time, start, end) {
      return (time > start);
    }
  } else if (endTime !== null) {
    timeFn = function(time, start, end) {
      return (time < end);
    }
  }  
  return timeFn;
}

function createCountMapFunc(key, val, timeFunc) {
  var str = "function() {";
  var keyStr = "this." + key;
  if (timeFunc !== null) {
    str = str + "if (timeFunc(this.server_utc, startTime, endTime)) {"
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

var countReduce = function(key, vals) {
  return Array.sum(vals);
}

function createMeanMapFunc(key, val, timeFunc) {
  var str = "function() {";
  var keyStr = "this." + key;
  if (timeFunc !== null) {
    str = str + "if (timeFunc(this.server_utc, startTime, endTime)) {"
  }
  str = str + "try {";
  str = str + "var value = {key: " + keyStr;
  if (val) {              
    var valStr = "this." + val;
    str = str + ",avg: 0, total: " + valStr;
  }
  str = str + ",count: 1}; emit( key, value );"
  str = str + "} catch(err) {}"
  if (timeFunc !== null) {
    str = str + "}";
  }
  str = str + "}";
  return str;
}

var meanReduce = function(key, vals) {
  var reducedObject = {
    userid: key,
    total_time: 0,
    count:0,
    avg_time:0
  };

  vals.forEach( function(value) {
      reducedObject.total_time += value.total_time;
      reducedObject.count += value.count;
    }
  );
    return reducedObject;
}



function count(key, val, timeFunc, response, o) {
  if (timeFunc !== null) {
    o.scope.timeFunc = timeFunc;
  }  
  var mapString = createCountMapFunc(key, val, timeFunc);
  //console.log(mapString + "\n");
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
          collection.mapReduce(mapFunc, countReduce, o, function(err, result) {
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

function mean(key, val, timeFunc, response, o) {
  if (timeFunc !== null) {
    o.scope.timeFunc = timeFunc;
  } 
  var mapString = createMeanMapFunc(key, val, timeFunc);
  //console.log(mapString + "\n");
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
  //console.log(timeFunc.toString());
  var o = {scope: {startTime: startTime, endTime: endTime}, out: {inline: 1}};
  if (subtype === "count") {
    //console.log("subtype correct");
    count(key, val, timeFunc, response, o);
  } else if (subtype === "mean") {
    mean(key, val, timeFunc, response, o);
  } else {
    //console.log("subtype WRONG");
    responseHandlers.invalidRequest(response, 2);
  }

  
}

exports.metric = metric;
