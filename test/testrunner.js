/*
* To run:
* method (either 'GET' or 'POST')
* hostname (the name of the server)
* port (the server's port)
* path ('/query' '/modify' etc)  DOES NOT CONTAIN any query parameters
* jsonFile The path to the JSON file containing the p or q parameter

*/
//$ node testrunner.js method hostname port path jsonFile

var http = require('http');
var fs = require('fs');
var oauth = require('../src/oauth');

var httpMethod = process.argv[2].toUpperCase();
var hostname = process.argv[3];
var portNo = process.argv[4];
var pathName = process.argv[5];
var jsonFile = process.argv[6];

var consumerKey = '9djdj82h48djs9d2';
var consumerSecret = 'kd94hf93k423kf44';
var secretsMap = {};
secretsMap[consumerKey] = consumerSecret;
oauth.setConsumerKeySecrets(secretsMap);





fs.readFile(jsonFile, function(err,data){
	var jsonFileString = data;
	var queryString = '';
	var postString = '';

	if(httpMethod == 'GET'){
		queryString = '?q=' + encodeURIComponent(jsonFileString);
	} else if(httpMethod == 'POST'){
		postString = 'p=' + encodeURIComponent(jsonFileString);
	}
	
	var nonce = Math.floor(Math.random()*2147483648).toString(16);
	var timestamp = (new Date()).getTime();


	var options = {
	  host: hostname,
	  path: pathName + queryString,
	  port: portNo,
	  method: httpMethod,
	  headers: {
	  'authorization': 'OAuth realm="Example",    oauth_consumer_key="' + consumerKey + '",	oauth_signature_method="HMAC-SHA1",		oauth_timestamp="' + timestamp + '",	oauth_nonce="' + nonce + '"',
	  'content-type' : 'application/x-www-form-urlencoded'
	  }
	};
	
	var headers = options.headers;
	headers['host'] = hostname + ':' + portNo;
	
	
	var oauthSignature = oauth.createOAuthSignature(httpMethod, headers, 'http',  options.path, postString);
	
	options.headers['authorization'] += ',oauth_signature="' + oauthSignature + '"';

	callback = function(response) {
	  var str = ''
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  response.on('end', function () {
		console.log(str);
	  });
	}

	var req = http.request(options, callback);
	req.write(postString);
	req.end();

});