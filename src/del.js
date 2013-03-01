var responseHandlers = require('./responseHandlers');
var queryValidation = require('./queryValidation');
var monGo = require('mongodb');


function del(obj_id,response) {

	queryValidation.validate(obj_id, function(err) {
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
	//collection.remove({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
							collection.remove({"_id": new monGo.ObjectID(obj_id)} , function(err, result) {
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
