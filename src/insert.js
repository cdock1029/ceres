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
		,ObjectID = require('mongodb').ObjectID
		,MongoClient = require('mongodb').MongoClient;
var i=0;
function insert(data, timestamp, response) {
	// validating the data to be inserted
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
				MongoClient.connect(mongoConfig.uri, function(err, db) {
				if(err) { 
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					db.collection(mongoConfig.collection, function(err, collection) {
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
						  var time = new Date().getTime(),
								oid = new ObjectID(),
								hash = md5(oid.toHexString()),
								obj = {'data_utc' : timestamp, 'server_utc' : time, '_id' : oid, 'hash' : hash}; 
						  obj.data = data;
							//inserting..
							collection.insert(obj, {}, function(err, result) {
								db.close();
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									console.log('Insert successful');
									var retVal = {id: result[0]._id}; 
									responseHandlers.validRequest(response, false, retVal);
								}
							});
						}
					});
				}
			});		
		}
	});
}
exports.insert = insert;

