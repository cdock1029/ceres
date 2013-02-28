var responseHandlers = require('./responseHandlers');
var schemaValidation = require('./schemaValidation');
var md5 = require('MD5');
var i = 0;
function insert(data, timestamp, response) {
	schemaValidation.validate(data, function(err) {
		if(err) {
			console.log(err);
			responseHandlers.invalidRequest(response, 2);
		} else {
            var mongoDb = require('mongodb');
						var server1,server2,server3,server4;
            server1 = new mongoDb.Server(mongoConfig.host1,mongoConfig.port1,{'auto_reconnect': true});
						server2 = new mongoDb.Server(mongoConfig.host2,mongoConfig.port2,{'auto_reconnect':true});
						server3 = new mongoDb.Server(mongoConfig.host3,mongoConfig.port3,{'auto_reconnect':true});
						server4 = new mongoDb.Server(mongoConfig.host4,mongoConfig.port4,{'auto_reconnect':true});
						var server = new Array(server1,server2,server3,server4);
            var db = new mongoDb.Db(mongoConfig.database, server[i], {w: 1});
						i = (i+1) % 4;
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
									//var hash = md5(time);
                            var obj = {'data_utc' : timestamp, 'server_utc' : time};//, 'hash': hash};
                            obj.data = data;
							collection.insert(obj, {w:1}, function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
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

