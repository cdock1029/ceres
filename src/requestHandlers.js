var fs = require('fs');
var querystring = require('querystring');
var responseHandlers = require('./responseHandlers');
var insertFunction = require('./insert');
var getFunction = require('./get');
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
	//TODO: fix
		
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
		if(postObj.type != "collect" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" || typeof(postObj.data) != "object"){
			responseHandlers.invalidRequest(response,2);
		} else {
			//TODO: remove line below.
			//responseHandlers.validRequest(response, false);
			var data = postObj.data;
			var timestamp = postObj.time_utc;
			 insertFunction.insert(data,timestamp,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
	

	
}
function modify(response, query, postData) {
 //TODO
}

function query(response, query, postData) {
	var queryObj;

	var queryString = decodeURIComponent(query);
	var queryJSON = querystring.parse(queryString).q;

	
	try {
		queryObj = JSON.parse(queryJSON);
		if(queryObj.type != "query" || typeof (queryObj.time_utc) != "number" || typeof (queryObj.authorize_id) != "number" || typeof(queryObj.expr) != "object"){
			responseHandlers.invalidRequest(response,2);
		} else {

			//TODO: remove line below.
			//responseHandlers.validRequest(response, true);
			var expr = queryObj.expr;
			var timestamp = queryObj.time_utc;
			getFunction.get(expr,timestamp,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}

function metric(response, query, postData) {
	//TODO
}

//deals with 404 errors.
function notFound(response, query, postData){
responseHandlers.invalidRequest(response,3);
}


//---END REQUEST HANDLERS---





exports.handle = handle;


