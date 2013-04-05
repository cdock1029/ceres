/* 
 * *---- DeleteAll function ----*
 *
 * Purpose: This method is to delete all records from
 * the database. It is especially useful for maintenance purposes.  
 */


var responseHandlers = require('./responseHandlers');
var MongoClient = require('mongodb').MongoClient;
function deleteAll(response) {
	//openning the database
    //var mongoDb = require('mongodb');
    //var server = new mongoDb.Server(mongoConfig.host,mongoConfig.port,{'auto_reconnect': true});
    //var db = new mongoDb.Db(mongoConfig.database, server, {w: 1});
    //db.open(function(err, db) {
		console.log("Before connect");
		MongoClient.connect(mongoConfig.uri, function(err, db) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			console.log("after sucessful connect call. before collection.")
			db.collection(mongoConfig.collection, function(err, collection) {
				if(err) {
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					//remove all records (that's what the empty query is for)
					console.log("after collection, before remove.");
					collection.remove({}, function(err, result) {
						db.close();
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
