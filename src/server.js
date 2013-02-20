var http = require("http");



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
			route(handle, urlString, response, postData);	
		
		});
	}
	
	http.createServer(onRequest).listen(nodeConfig.port);
	console.log("Server has started.");
}

exports.start = start;
