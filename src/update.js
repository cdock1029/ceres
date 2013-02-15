var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');
var updateValidation = require('./updateValidation');

function update(expression, data, timestamp, response) {
	updateValidation.validate(expression, function(err) {
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
						//need to check this						
						//can use : collection.update({_id:"123"}, {$set: {author:"Jessica"}});
							collection.update(expression, {$set: data} , function(err, result) {
								if(err) {
									//display db error
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
