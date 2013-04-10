/** 
 * <h>*---- Delete function ----*</h>
 * @param  object id: string
 *
 * <p>Purpose: This method is to delete a single record from
 * the database based on the object id passed to it. </p>
 */

var responseHandlers = require('./responseHandlers'),
	queryValidation = require('./queryValidation'),
	monGo = require('mongodb'),
    ObjectID = require('mongodb').ObjectID,
	MongoClient = require('mongodb').MongoClient;
	
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

exports.del = del;
