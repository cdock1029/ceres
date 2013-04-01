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
var MongoClient = require('mongodb').MongoClient,
		ObjectID = require('mongodb').ObjectID;
function update(obj_id, data, timestamp, response) {
	//validate object id
	updateValidation.validate(obj_id, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
				// openning the database
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
							// Querying the db for the record with that object id, updating it data, and re-inserting it back.
							collection.update({"_id": new monGo.ObjectID(obj_id)}, {$set: data} , function(err, result) {
								db.close();	
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									responseHandlers.validRequest(response, true, result);
								}
							});
						}
					});
				}
			});		
		}
	});
}
exports.update = update;
