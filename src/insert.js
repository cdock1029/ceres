//var MongoClient = require('mongodb').MongoClient;
var responseHandlers = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');

function insert(data, timestamp, response) {
    console.log("inside function");
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
			//hard coded database address and name. Needs refactored.
            var mongoDb = require('mongodb');
            var server = new mongoDb.Server("127.0.0.1",27017,{'auto_reconnect': true});
            var db = new mongoDb.Db('exampleDb', server, {w: 1});
            console.log("open sesame");
            db.open(function(err, db) {
			//MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
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
                            var obj = {'data_utc' : timestamp, 'server_utc' : new Date().getTime()};
                            obj.data = data;
							collection.insert(obj, {w:1}, function(err, result) {
								if(err) {
									//do something with db error
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									responseHandlers.validRequest(response, false, result);
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

exports.insert = insert;

