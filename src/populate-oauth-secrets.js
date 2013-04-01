/**
* Loads OAuth consumer keys and secrets into MongoDB.
* They will be loaded into the collection specified as the oauth_collection in the mongodb.json config file.
* This will REPLACE all oauth secrets in Mongo.
* The oauth secrets are loaded from the file config/oauth-secrets.json .  After this script is executed, the oauth secrets in this file will
* be the ONLY oauth secrets stored in Mongo.
* To run, put all of the keys that you want in the db into the config file mentioned above and run:
* $ node populate-oauth-secrets.js
*/
var config = require('konphyg')(__dirname + '/../config');
var mongoConfig = config('mongodb');
var MongoClient = require('mongodb').MongoClient;

//load oauth secrets file
var oauth_secrets = require('../config/oauth-secrets.json');

var uri = mongoConfig.uri;

MongoClient.connect(uri, function(err, db) {
	if(err){
		console.log(err);
	} else {
		db.collection(mongoConfig.oauth_collection, function(err, collection){
			
			//remove all old oauth secrets.
			collection.remove({}, function(err, result){
				if(err){
					console.log('Error deleting old secrets' + err);
					process.exit(1);
				}
			});
			collection.insert(oauth_secrets, {w:1}, function(err, result) {
				if(err){
					console.log('error inserting' + err);
				} else {
					console.log('Oauth secrets successfully populated');
				}
			
				db.close();
			});
		});
	}

});


