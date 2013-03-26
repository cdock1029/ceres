/* 
 * *---- Insert function ----*
 * Parameter: expression: string
 *
 * Purpose: This method is to insert a record to 
 * the database.  
 */

var responseHandlers = require('./responseHandlers')
		,schemaValidation = require('./schemaValidation')
		,mongoDb = require('mongodb')
		,md5 = require('MD5')
		,ObjectID = require('mongodb').ObjectID;
var i=0;
function insert(data, timestamp, response) {
	// validating the data to be inserted
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			//console.log("opening db..");
			server = new mongoDb.Server(mongoConfig.host,mongoConfig.port,{'auto_reconnect': true, 'poolSize': 5});
			//openning the database
			server = new mongoDb.Server(mongoConfig.host,mongoConfig.port,{'auto_reconnect': true});
			db = new mongoDb.Db(mongoConfig.database, server, {w: 1});
      db.open(function(err, db) {
				if(err) { 
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					db.collection(mongoConfig.collection, function(err, collection) {
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
							//going to instantiate document fields
														var time = new Date().getTime(),
																oid = new ObjectID(),
																hash = md5(oid.toHexString()),
                            		obj = {'data_utc' : timestamp, 'server_utc' : time, '_id' : oid, 'hash' : hash}; 
                            obj.data = data;
							//inserting..
							collection.insert(obj, {w:1}, function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									console.log('Insert successful');
									responseHandlers.validRequest(response, false, result);
								}
							db.close();
							});
						}
					});
				}
			});		
		}
	});
}
exports.insert = insert;

