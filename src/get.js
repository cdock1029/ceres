/* 
 * *---- Get function ----*
 * Parameter: expression: string
 *
 * Purpose: This method is for retrieving a record from
 * the database that matches the query(i.e. expression). 
 */

var responseHandlers = require('./responseHandlers');
var queryValidation = require('./queryValidation');

function get(expression, timestamp, response) {
	// validate the expression
	queryValidation.validate(expression, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
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
							// find the record that maches the expression (find returns a cursor, so need to use toArray to get the record)
						     	collection.find(expression).toArray(function(err, result) {
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

exports.get = get;
