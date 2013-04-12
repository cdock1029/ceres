/** 
This is the main program that accepts client requests and call other functions.
@module requestHandler
**/
var fs = require('fs'),
	 querystring = require('querystring'),
	 spawn = require('child_process').spawn,
	 responseHandlers = require('./responseHandlers'),
	 insertFunction = require('./insert'),
	 updateFunction = require('./update'),
	 deleteFunction = require('./del'),
	 deleteAllFunction = require('./deleteAll'),
	 getFunction = require('./get');
	//var metricFunction = require('./metric');
var handle = {};

/*
* Add more request handlers here.
*/
handle["/"] = index;
handle["/index"] = index;
handle["/index.html"] = index;
handle["notFound"] = notFound;
handle["/data"] = dataHandler;
handle["/metrics"] = metrics;

//=======================================================================
// REQUEST HANDLERS
//=======================================================================



function index(response, method, query, postData) {
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
		if(postData.type === "modify" && typeof (postData.time_utc) == "number" && typeof (postData.authorize_id) == "number" && typeof(postData.data) == "object" && typeof(postData.obj_id) == "string" && validateObjID(postData.obj_id) == true){
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
		console.log(queryObj);
		if(queryObj != null && queryObj.type === "delete" && typeof (queryObj.authorize_id) == "number" && typeof(queryObj.obj_id) == "string" && validateObjID(queryObj.obj_id) == true){
			var expr = queryObj.obj_id;
			deleteFunction.del(expr,response);
		} else if(queryObj != null && queryObj.type === "deleteAll" && typeof (queryObj.authorize_id) == "number") {
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
	var queryObj = decodeQuery(query);
	
	if (queryObj != null) {
		var output;
		var parameters = new Array();
		parameters[0] = 'Analytics/Analytics.py';
		if (typeof (queryObj.subtype) == "string"){
			parameters[1] = queryObj.subtype;
			
			// Check the subtype parameters
			if (queryObj.subtype == "count" || queryObj.subtype == "mean"){
				if(typeof(queryObj.Start_time_utc) == "number" && typeof (queryObj.End_time_utc) == "number"&& typeof (queryObj.data) == "object"){
					parameters[2] = queryObj.Start_time_utc;
					parameters[3] = queryObj.End_time_utc;
					parameters[4] = JSON.stringify(queryObj.data);
				}
			} else if (queryObj.subtype == "std" || queryObj.subtype == "var" || queryObj.subtype == "max" || queryObj.subtype == "min") {
				if(typeof(queryObj.Start_time_utc) == "number" && typeof (queryObj.End_time_utc) == "number" && typeof (queryObj.Period) == "number" && typeof (queryObj.data) == "object"){			
					parameters[2] = queryObj.Start_time_utc;
					parameters[3] = queryObj.End_time_utc;
					parameters[4] = queryObj.Period;
					parameters[5] = JSON.stringify(queryObj.data);
				} else {
					responseHandlers.invalidRequest(response,2);
				}
			}
		}
		
		// Spawn the process
		var p = spawn('python', parameters);
		
		// Return the result data
		p.stdout.on('data', function (data) {
			data = data.toString('utf8');
			console.log('stdout: ' + data);
			output = data;
		});
		
		// Return if error.
		p.stderr.on('data', function (data) {
			data = data.toString('utf8');
			console.log('stderr: ' + data);
			output = data;
		});

		// Exit on server error. 
		p.on('exit', function (code) {
			console.log('child process exited with code ' + code);
			responseHandlers.validRequest(response, true, output);
		});
	} else {
		responseHandlers.invalidRequest(response,2);
	}
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

/**
* @param a string containing the object id to validate
* @return true if it is 24 hex characters, false if not
*/
function validateObjID(obj_id){
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	if(obj_id.search(checkForHexRegExp) == -1){
		return false;
	} else {
		return true;
	}
}

exports.handle = handle;
