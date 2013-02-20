var responseHandlers = require('./responseHandlers');
var queryValidation = require('./queryValidation');

function del(expression, flag, data, timestamp, response) {
	queryValidation.validate(expression, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
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
							collection.remove(expression, flag , function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
									console.log('Delete successful');
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

exports.del = del;
