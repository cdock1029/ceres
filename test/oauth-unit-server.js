var http = require("http");
var oauth = require("../src/oauth");

oauth.setConsumerKeySecrets({'9djdj82h48djs9d2' : 'kd94hf93k423kf44'});

function start(route, handle) {
	function onRequest(request, response) {
		var urlString = request.url;
		var postData = "";
		console.log("Request for " + urlString + " received.");
		
		
		request.setEncoding("utf8");
		request.addListener("data",function(postDataChunk) {
			postData += postDataChunk;
		
		});
		request.addListener("end", function(){
			var sig = oauth.createOAuthSignature(request.method, request.headers, "http", urlString, postData);
			response.writeHead(200,  {"Content-Type" : "text/plain" });
			response.end(sig.toString());
		});
	}
	
	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

start();
