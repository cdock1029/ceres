/** 
Delete ALL function</br>
Purpose: This method is to delete all the records from
the database. This function connects to the database through mongoClient.

@param response: http response object 
@module deleteAll

**/

var responseHandlers = require('./responseHandlers');
var MongoClient = require('mongodb').MongoClient;

function deleteAll(response) {
	// connecting to the database
		MongoClient.connect(mongoConfig.uri, function(err, db) {
		if(err) {
			//output any errors 
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else { // connection sucessful
			db.collection(mongoConfig.collection, function(err, collection) {
				if(err) {
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					//remove all records in the database(that's what the empty query for)
					collection.remove({}, function(err, result) {
						db.close();//close database connection
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
							console.log('Delete All successful');
							var retVal = {num_records: result};
							responseHandlers.validRequest(response, true, retVal);
						}
					});
				}
			
			});
		}
	});	
}
exports.deleteAll = deleteAll;
