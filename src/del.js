var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');
var queryValidation = require('./queryValidation');

function del(expression, flag, data, timestamp, response) {
	queryValidate.validate(expression, function(err) {
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
						//collection.update({_id:"123"}, {$set: {author:"Jessica"}});
						//we can also replace expr with id
							collection.remove(expression, flag , function(err, result) {
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

exports.del = del;
