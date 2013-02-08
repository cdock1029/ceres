var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');

function insert(data, timestamp, response) {
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			//hard coded database address and name. Needs refactored.
			MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
				if(err) { 
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				} else {
					//hard coded collection name. Needs refactored.
					db.collection('test', function(err, collection) {
						if(err) {
							console.log(err);
							responseHandlers.invalidRequest(response, 2);
						} else {
							collection.insert(data, {w:1}, function(err, result) {
								if(err) {
									//do something with db error
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									responseHandlers.validRequest(response, false, result);
								}
							});
						}
					});
				}
			});		
		}
	});
}

exports.insert = insert;
