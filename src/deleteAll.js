
var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');

function deleteAll(timestamp, response) {
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
			/*
			To remove all documents in a collection, call the remove method with no parameters:
				db.collection.remove()
			*/
				collection.remove({}, function(err, result) {
				if(err) {
					//do something with db error
					console.log("Error: Database may be empty or you don't have permisson!");
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



exports.deleteAll = deleteAll;