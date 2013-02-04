var fs = require('fs');

var responseHandlers = require('./responseHandlers');
var handle = {};


/*
* Add more request handlers here.
*/
handle["/"] = index;
handle["/index"] = index;
handle["/index.html"] = index;
handle["/collect"] = collect;
handle["/modify"] = modify;
handle["/query"] = query;
handle["/metric"] = metric;
handle["notFound"] = notFound;


function index(response, query, postData) { 
	var indHtml;  
		
		if(query.file == null){
			indHtml = fs.readFileSync('../doc/index.html');  
		} else {
			indHtml = fs.readFileSync('../doc/' + query.file);
		}
		
  		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(indHtml);
		response.end();
}

function collect(response, query, postData) {
	var postObj;
	try {
		postObj = JSON.parse(postData);
		if(postObj.type != "collect"){
			responseHandlers.invalidRequest(response,2);
		} else {
			responseHandlers.validRequest(response, false);
		}
	} catch(err){
		console.log(err);
		responseHandlers.invalidRequest(response, 2);
	}
	

	
}
function modify(response, query, postData) {

}

function query(response, query, postData) {

}

function metric(response, query, postData) {

}

//deals with 404 errors.
function notFound(response, query, postData){
responseHandlers.invalidRequest(response,3);
}


//---END REQUEST HANDLERS---





exports.handle = handle;


