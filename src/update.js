var responseHandlers = require('./responseHandlers');
var updateValidation = require('./updateValidation');

function update(expression, data, timestamp, response) {
	updateValidation.validate(expression, function(err) {
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
							collection.update(expression, {$set: data} , function(err, result) {
								if(err) {
									console.log(err);
									responseHandlers.invalidRequest(response, 2);
								} else {
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
exports.update = update;
