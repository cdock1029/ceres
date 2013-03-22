/* 
 * *---- Update function ----*
 * Parameter: object id: string
 *
 * Purpose: This method is to update an existing record in 
 * the database using the object id.  
 */
 
var responseHandlers = require('./responseHandlers');
var updateValidation = require('./updateValidation');
var monGo = require('mongodb');

function update(obj_id, data, timestamp, response) {
	//validate object id
	updateValidation.validate(obj_id, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			// openning the database
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
							// Querying the db for the record with that object id, updating it data, and re-inserting it back.
							collection.update({"_id": new monGo.ObjectID(obj_id)}, {$set: data} , function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									responseHandlers.validRequest(response, true, result);
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
exports.update = update;
