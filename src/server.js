/**
Purpose: This module is used to initialize the node server and
start the application to listen for requests.

@module: server

**/


var http = require("http");
var responseHandlers = require('./responseHandlers');
var jsonsp = require('jsonsp');
var util = require('util');
var oauth = require('./oauth');
/**
Purpose: this function starts the node server and listens for requests.
It also handles the requestes and passes on to the corresponding modules.
@param route 
@param handle
@method start 
**/
function start(route, handle) {
	function onRequest(request, response) {
		var urlString = request.url;
		var postData = "";
		var postDataRaw = "";
		var method = request.method;
		
		var parser = new jsonsp.Parser();
		if (method == "GET" || method == "DELETE"){
			var sig_valid = false;
			if(nodeConfig.oauth_enabled == true){
				sig_valid = oauth.verifyOAuthSignature(method.toUpperCase(), request.headers, "http", urlString, "");
			} else {
				sig_valid = true;
			}
			if(sig_valid == true){
				route(handle, method, urlString, response, postData);		
			} else {
				responseHandlers.invalidRequest(response,1);
			}
		}
		else {
			parser.on('object', function(input) {
				postData = input;
				request.addListener("end", function(){
						var sig_valid = false;
						if(nodeConfig.oauth_enabled == true){
							sig_valid = oauth.verifyOAuthSignature(request.method.toUpperCase(), request.headers, "http", urlString, postDataRaw);
						} else {
							sig_valid = true;
						}
						if(sig_valid == true){
							route(handle, method, urlString, response, postData);		
						} else {
							responseHandlers.invalidRequest(response,1);
						}		
				});
			});
			parser.on('error', function (input) {
				console.log("parse error");
				responseHandlers.invalidRequest(response,2);	
			});
		}		
		
		console.log("Request for " + urlString + " received.");
	
		//see comments below for more details.
		var chunkEnd = "";
		request.addListener("data", function(postDataChunk) {
			postDataChunk = postDataChunk.toString('utf8');
			postDataRaw += postDataChunk;
			if(postDataChunk[0] == 'p' && postDataChunk[1] == '='){
				//get rid of p= at the front.
				postDataChunk = postDataChunk.substring(2);
			}
			/*
			* Since the data is URL encoded, a chunk could end with part of a URL encoded character.
			* For example, a chunk "%7B%22type%22%3A%" could come in, and then a chunk "22collect%22" after it.
			* This would be a problem for decodeURIComponent due to the %22 being split between the two chunks.
			* The partial urlencoded character will be stored in the chunkEnd variable and prepended to the next chunk.
			*/
			//prepend partial URLencoded character (if any) from last chunk to the current chunk
			postDataChunk = chunkEnd + postDataChunk;
			if(postDataChunk[postDataChunk.length - 1] == '%'){
				//ends with %
				chunkEnd = '%';
				postDataChunk = postDataChunk.substring(0, postDataChunk.length -1);
			} else if(postDataChunk[postDataChunk.length - 2] == '%'){
				//second to last character is %
				chunkEnd = postDataChunk.substring(postDataChunk.length-2, postDataChunk.length);
				postDataChunk = postDataChunk.substring(0, postDataChunk.length -2);
			} else {
				chunkEnd = "";
			}

			parser.parse(decodeURIComponent(postDataChunk));
		});			
	}
	http.createServer(onRequest).listen(nodeConfig.port);
	console.log("Server has started.");
}

exports.start = start;
