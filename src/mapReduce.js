/**
Collections of functions that execute ditributed map-reduce queries.
Useful in sharded environments with BIG data.
@class mapReduce
**/
var responseHandlers = require('./responseHandlers'),
  Code = require('mongodb').Code,
  MongoClient = require('mongodb').MongoClient;

/**
Builds the correct time function, or null depending
on whether time parameters were passed in with query.
@class createTimeFunc
**/
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

/**
* Build the map function for "count". Key and
* val params are concatenated with "this" param within mongodb.
* @param paramter each result is grouped by.
* @param the value you want to calculate for a given 'key'.If null, then just counts occurrances of each 'key'. 
* @param time function appropriate for user specified start and end times, or null. 
*/
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

/**
* For count function, this specifies operation to perform to consolidate map results.
* Here we are simply adding together all values for given key.
* @param key is passed in by default to reduce function. Not used here.
* @param Array of values, one for each time emit was called for the given key in the map function.
*/
var countReduce = function(key, vals) {
  return Array.sum(vals);
};

/**
* Builds the map function for mean.
* @param the parameter to group the results by. If null, result will be one document with value reduced over entire collection.
* @param the value of which the user is querying a mean for. If null, this function will count occurences of each 'key', as in the count function.
* @param time function to narrow search by, defined according to user specified start and end times, or null if not provided.
*/
function createMeanMapFunc(key, val, timeFunc) {
  var str = "function() {";
  var keyStr = "this." + key;
  var valStr = "this." + val;
  if (timeFunc !== null) {
    str = str + "if (timeFunc(this.server_utc, startTime, endTime)) {"
  }
  str = str + "try {";
  str = str + "var group =  " + keyStr;
  str = str + ", value = {group: " + keyStr;
  str = str + ", avg: 0, total: " + valStr;
  str = str + ", count: 1}; emit( group, value );"
  str = str + "} catch(err) {}"
  if (timeFunc !== null) {
    str = str + "}";
  }
  str = str + "}";
  return str;
}

/**
* reducer for mean operation. Creates an intermediate set of objects that will be passed to finalize.
* @param key to which the values being averaged are grouped by.
* @param Array of values for a given key. 
*/
var meanReduce = function(key, vals) {
  var reducedObject = {
    group: key,
    total: 0,
    count:0,
    avg:0
  };

  vals.forEach( function(value) {
      reducedObject.total += value.total;
      reducedObject.count += value.count;
    }
  );
  return reducedObject;
};

/**
* A final reducer called after meanReducer by mongodb.
* If count is greater than zero, this function finds mean for value parameter specified in query.
* @param key that mean will be grouped by
* @param temporary object passed from reduce function.
*/
var meanFinalize = function(key, reducedValue) {
  if (reducedValue.count > 0) {
    reducedValue.avg = reducedValue.total / reducedValue.count;
  }
  return reducedValue;
};

var createMinMaxMapFunc = function(key, val, timeFunc) {
  /*
  var x = { value: this.val, _id : this._id };
  emit(this.key, { min : x , max : x } )
  */
  var str = "function() {";
  var keyStr = "this." + key;
  var valStr = "this." + val;
  if (timeFunc !== null) {
    str = str + "if (timeFunc(this.server_utc, startTime, endTime)) {"
  }
  str = str + "try {";
 
  str = str + "var x = { value: " + valStr + ", _id : this._id };";
  str = str + "emit(" + keyStr + ", { min : x , max : x } )";
  str = str + "} catch(err) {}"
  if (timeFunc !== null) {
    str = str + "}";
  }
  str = str + "}";
  return str;
}

var minMaxReduce = function(key, values) {
  var res = values[0];
    for ( var i=1; i<values.length; i++ ) {
        if ( values[i].min.value < res.min.value ) 
           res.min = values[i].min;
        if ( values[i].max.value > res.max.value ) 
           res.max = values[i].max;
    }
  return res;
}



/**
* Assembles components for count operation, then runs map reduce on mongodb.
* @param field that map reduce will group the results by (in this case the counts for each different 'key' in collection).
* @param field that user wants to count, or null in which case this function will count occurences of each 'key'
* @param time function to be applied to narrow results by, specified by startTime and endTime in request.
* @param options object which will be passed to mongodb with configuration paramters for map reduce. 
*/
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

/**
* Assembles components for mean operation, then runs map reduce query on mongodb.
* @param field that map reduce will group the results by (in this case the counts for each different 'key' in collection).
* @param field that user wants to find the mean of, or null in which case this function will revert to functionality of a count call with a null value (counts occurances of each type of 'key'). 
* @param time function to be applied to narrow results by, specified by startTime and endTime in request.
* @param options object which will be passed to mongodb with configuration paramters for map reduce. 
*/
function mean(key, val, timeFunc, response, o) {
  if (timeFunc !== null) {
    o.scope.timeFunc = timeFunc;
  } 
  var mapString = createMeanMapFunc(key, val, timeFunc);
  console.log(mapString + "\n");
  var mapFunc = new Code(mapString);
  o.finalize = meanFinalize;
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
          collection.mapReduce(mapFunc, meanReduce, o, function(err, result) {
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

function minMax(key, val, timeFunc, response, o) {
  // TODO: EDIT THIS IS A COPY OF MEAN!! 
  if (timeFunc !== null) {
    o.scope.timeFunc = timeFunc;
  } 
  var mapString = createMinMaxMapFunc(key, val, timeFunc);
  console.log(mapString + "\n");
  var mapFunc = new Code(mapString);
  //o.finalize = meanFinalize;
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
          collection.mapReduce(mapFunc, minMaxReduce, o, function(err, result) {
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

/**
* Entry point for requestHandlers.js. Reads subtype parameter and makes appropriate map reduce function call.
* Poulates the timeFunc and o (options) parameters to be passed to map reduce function.
* @param string defining which map reduce operation to run.
* @param lower bound of server time to query for records, if not null.
* @param upper bound of server time to query for records, if not null.
* @param key field to group results by.
* @param value field which is being counted, averaged, etc.
* @param response object that will be populated with results and passed to responseHandlers.js
*/
function metric(subtype, startTime, endTime, key, val, response) {
  // main entry point for metrics. Branch to functions based on subtype, and rest of params.
  timeFunc = createTimeFunc(startTime, endTime); 
  //console.log(timeFunc.toString());
  var o = {scope: {startTime: startTime, endTime: endTime}, out: {inline: 1}};
  if (subtype === "count") {
    count(key, val, timeFunc, response, o);
  } else if (subtype === "mean") {
    mean(key, val, timeFunc, response, o);
  } else if (subtype === "minMax") {
    minMax(key, val, timeFunc, response, o);
    //responseHandlers.invalidRequest(response, 2);   
  } else {
    //console.log("subtype WRONG");
    responseHandlers.invalidRequest(response, 2);
  }

}

exports.metric = metric;
