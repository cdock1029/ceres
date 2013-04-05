/**
* Loads OAuth secrets from the mongo collection specified in the oauth_collection variable of the ../config/mongodb.json config file.
* This should be called by index.js.
*/

var oauth = require('./oauth');
var MongoClient = require('mongodb').MongoClient;
var config = require('konphyg')(__dirname + '/../config');
var mongoConfig = config('mongodb');

function loadOAuthSecrets(){

var uri = mongoConfig.uri;

MongoClient.connect(uri, function(err, db) {
	if(err){
		console.log(err);
	} else {
		db.collection(mongoConfig.oauth_collection, function(err, collection){
			collection.find({}).toArray(function(err,result){
				if(err){
					console.log(err);
				} else {
					oauth.setConsumerKeySecrets(result[0]);
				}
							db.close();
			});

			
		});
	}

});
}

exports.loadOAuthSecrets = loadOAuthSecrets;
