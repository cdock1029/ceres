/* 
 * *---- Request Handlers ----*
 * This is the main program that accepts client requests and call other functions. 
 */
var fs = require('fs');
var querystring = require('querystring');
var spawn = require('child_process').spawn;
var responseHandlers = require('./responseHandlers');
var insertFunction = require('./insert');
var updateFunction = require('./update');
var deleteFunction = require('./del');
var deleteAllFunction = require('./deleteAll');
var getFunction = require('./get');

//var metricFunction = require('./metric');
var handle = {};

/*
* Add more request handlers here.
*/
handle["/"] = index;
handle["/index"] = index;
handle["/index.html"] = index;
/*
handle["/collect"] = collect;
handle["/modify"] = modify;
handle["/query"] = query;
handle["/metric"] = metric;
handle["notFound"] = notFound;
handle["/delete"] = del;
handle["/deleteAll"] = deleteAll;
*/
handle["/data"] = dataHandler;
handle["/metrics"] = metrics;

//=======================================================================
// REQUEST HANDLERS
//=======================================================================



function index(response, method, query, postData) {
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

/**
* Response handler to /data URI.
* @param The http.server.response object of the request.
* @param method The HTTP method (in all caps).
* @param query The query string component of the URI
* @param postData The post data (parsed into an Object).
*/
function dataHandler(response, method, query, postData){

	if(method == 'GET'){
		//must be a query
		var queryObj = decodeQuery(query);
		if(queryObj != null && queryObj.type === "query"  && typeof (queryObj.authorize_id) == "number" && typeof(queryObj.expr) == "object") {
			//valid query request
			var expr = queryObj.expr;
			var timestamp = queryObj.time_utc;
			getFunction.get(expr,timestamp,response);
		} else {
			//invalid query request
			responseHandlers.invalidRequest(response, 2);
		}
	} else if(method == 'POST'){
		//must be a collect
		if(postData.type === "collect" && typeof (postData.time_utc) == "number" && typeof (postData.authorize_id) == "number" && typeof(postData.data) == "object"){
			//valid collect request
			var data = postData.data;
			var timestamp = postData.time_utc;
			insertFunction.insert(data,timestamp,response);
		} else {
			//invalid collect request
			responseHandlers.invalidRequest(response, 2);
		}
	} else if(method == 'PUT') {
		//must be an update
		if(postData.type === "modify" && typeof (postData.time_utc) == "number" && typeof (postData.authorize_id) == "number" && typeof(postData.data) == "object" && typeof(postData.obj_id) == "string"){
			//valid update request
			var objID = postData.obj_id;	
			var data = postData.data;
			var timestamp = postData.time_utc;
			updateFunction.update(objID,data,timestamp,response);
		} else {
			//invalid update request
			responseHandlers.invalidRequest(response,2);
		}
	} else if(method == 'DELETE'){		
		//must be a delete
		var queryObj = decodeQuery(query);
		console.log(postData);
		if(queryObj.type === "delete" && typeof (queryObj.authorize_id) == "number" && typeof(queryObj.obj_id) == "string"){
			var expr = queryObj.obj_id;
			deleteFunction.del(expr,response);
		} else if(queryObj.type === "deleteAll" && typeof (queryObj.authorize_id) == "number") {
			deleteAllFunction.deleteAll(response);
		} else {
			//invalid delete request
			responseHandlers.invalidRequest(response,2);
		}
	} else {
		//other HTTP methods are currently not supported
		responseHandlers.invalidRequest(response, 2);
	}

	

	
}

/**
* Response handler to /metrics URI.
* @param The http.server.response object of the request.
* @param method The HTTP method (in all caps).
* @param query The query string component of the URI
* @param postData The post data (parsed into an Object). (should be empty for a metric request)
*/
function metrics(response, method, query, postData){
//TODO: validate the request and run the metrics

	var queryObj = decodeQuery(query);
	
	var output;
	var p = spawn('python', ['../test/hello.py']);
	p.stdout.on('data', function (data) {
		data = data.toString('utf8');
		console.log('stdout: ' + data);
		output = data;
	});
	
	p.stderr.on('data', function (data) {
		data = data.toString('utf8');
		console.log('stderr: ' + data);
		output = data;
	});

	p.on('exit', function (code) {
		console.log('child process exited with code ' + code);
		responseHandlers.validRequest(response, true, output);
	});
}


//deals with 404 errors.
function notFound(response, query, postData){
responseHandlers.invalidRequest(response,3);
}

//---END REQUEST HANDLERS---


//=======================================================================
//Helper Functions
//=======================================================================

/**
* Decodes a query string in the form q=<URI-encoded JSON object>.
* @param query A query string in the form q=<URI-encoded JSON object>
* @return An object created from the JSON, or null if there's an error.
*/
function decodeQuery(query){
	var queryObj; //will be the decoded JSON string of the q parameter (if any exists).
	var queryString = decodeURIComponent(query);
	var queryJSON = querystring.parse(queryString).q;
	try {
		queryObj = JSON.parse(queryJSON);
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			return null;
		}
	}
	
	return queryObj;
}


exports.handle = handle;
