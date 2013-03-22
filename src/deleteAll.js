/* 
 * *---- DeleteAll function ----*
 *
 * Purpose: This method is to delete all records from
 * the database. It is especially useful for maintenance purposes.  
 */


var responseHandlers = require('./responseHandlers');

function deleteAll(response) {
	//openning the database
    var mongoDb = require('mongodb');
    var server = new mongoDb.Server(mongoConfig.host,mongoConfig.port,{'auto_reconnect': true});
    var db = new mongoDb.Db(mongoConfig.database, server, {w: 1});
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
				//remove all records (that's what the empty query is for)
					collection.remove({}, function(err, result) {
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
							console.log('Delete All successful');
							responseHandlers.validRequest(response, true, result);
						}
						db.close();
					});
				}
			
			});
		}
	});	
}
exports.deleteAll = deleteAll;