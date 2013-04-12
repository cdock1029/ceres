/** 
Insert function</br>
Purpose: This method is to update an existing record in 
the database using the object id. This function
connects to the database through mongoClient.
@param	obj_id: id of the object to be modified
@param  data: data object json string
@param	timestamp: timestamp object json string
@param	response: http response object 
@module update
**/
 
var responseHandlers = require('./responseHandlers'),
	schemaValidation = require('./schemaValidation'), 
	monGo = require('mongodb'),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID;
	
function update(obj_id, data, timestamp, response) {
	//validate object id
	schemaValidation.validate(data, function(err) {
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
									var retVal = {num_records: result};
									responseHandlers.validRequest(response, true, retVal);
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
