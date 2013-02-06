var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');

function insert(data, timestamp, response) {

	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
				if(err) { 
					console.log(err);
					responseHandlers.invalidRequest(response, 2);
				}
				db.collection('test', function(err, collection) {
					collection.insert(data, {w:1}, function(err, result) {
						if(err) {
							//do something with db error
						} else {
							responseHandlers.validRequest(response, false, result);
						}
					});
				});
			});		
		}
	});
}
