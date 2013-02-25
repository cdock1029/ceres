var http = require("http");
var responseHandlers = require('./responseHandlers');
var jsonsp = require('jsonsp');
var util = require('util');

function start(route, handle) {
	function onRequest(request, response) {
		var urlString = request.url;
		var postData = "";
		
		var parser = new jsonsp.Parser();
		if (request.method == "GET"){
			route(handle, urlString, response, postData);		
		}
		else {
			parser.on('object', function(input) {
				postData = input;
				request.addListener("end", function(){
					route(handle, urlString, response, postData);		
				});
			});
			parser.on('error', function (input) {
				responseHandlers.invalidRequest(response,2);	
			});
		}		
		
		console.log("Request for " + urlString + " received.");
	
		request.addListener("data", function(postDataChunk) {
			parser.parse(postDataChunk.toString('utf8'));
		});			
	}
	
	
	http.createServer(onRequest).listen(nodeConfig.port);
	console.log("Server has started.");
}

exports.start = start;
