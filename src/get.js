
/** 
Get function</br>
Purpose: This method is for retrieving a record from
the database that matches the query(i.e. expression). This function
connects to the database through mongoClient.
@param  expression: string
@param	timestamp: timestamp data json string
@param	response: http response object 
@module get
**/


var responseHandlers = require('./responseHandlers'),
	queryValidation = require('./queryValidation'),
	MongoClient = require('mongodb').MongoClient;

function get(expression, timestamp, response) {
	// validate the expression
	queryValidation.validate(expression, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			//connecting to the database
				MongoClient.connect(mongoConfig.uri, function(err,db) {	
				if(err) { 
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					db.collection(mongoConfig.collection, function(err, collection) {
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
							// find the record that maches the expression 
						    collection.find(expression).toArray(function(err, result) {
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

exports.get = get;
