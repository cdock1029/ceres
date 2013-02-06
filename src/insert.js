var MongoClient = require('mongodb').MongoClient;
var responseHandler = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');

function insert(data, timestamp, response) {

	schemaValidation.validate(data, function(err) {
		if(err) {
			//do something if not valid.	
		} else {
			MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
				if(err) { return console.dir(err); }
				db.collection('test', function(err, collection) {
					collection.insert(data, {w:1}, function(err, result) {
						if(err) {
							//do something with db error
						}
					});
				});
			});		
		}
	});
}
