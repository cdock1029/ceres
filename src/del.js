/* 
 * *---- Delete function ----*
 * Parameter: object id: string
 *
 * Purpose: This method is to delete a single record from
 * the database based on the object id passed to it. 
 */

var responseHandlers = require('./responseHandlers');
var queryValidation = require('./queryValidation');
var monGo = require('mongodb');
var ObjectID = require('mongodb').ObjectID 
 		,MongoClient = require('mongodb').MongoClient;
function del(obj_id,response) {
	// validate object id, if not valid report the error
	queryValidation.validate(obj_id, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
		//openning the database
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
						//delete the record using the object id
								collection.remove({"_id": new monGo.ObjectID(obj_id)} , function(err, result) {
								db.close();
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									console.log('Delete successful');
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

exports.del = del;
