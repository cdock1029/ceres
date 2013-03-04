var responseHandlers = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');
var mongoDb = require('mongodb');
var server = new mongoDb.Server(mongoConfig.host,mongoConfig.port,{'auto_reconnect': true});
var db = new mongoDb.Db(mongoConfig.database, server, {w: 1});
var i=0;
function insert(data, timestamp, response) {
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
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
														var time = new Date().getTime();
                            var obj = {'data_utc' : timestamp, 'server_utc' : time, 'shard' : i}; 
                            obj.data = data;
							collection.insert(obj, {w:1}, function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									i = (i+1) % mongoConfig.shards;
									console.log('Insert successful');
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

