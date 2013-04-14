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
	 getFunction = require('./get'),
	 metricFunction = require('./mapReduce');
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
	var subtype, start_time, end_time, key, val;
	//check for required elements: auth id, subtype, key
	if (queryObj != null && typeof(queryObj.authorize_id) == "number" && typeof(queryObj.subtype) == "string" && typeof(queryObj.key) == "string") {
		// value param is optional..
		subtype = queryObj.subtype;
		key = queryObj.key;
		if (queryObj.value != null) {
			val = queryObj.value;	
		} else { //no value param, just a key
			val = null;
		}	
		if (queryObj.start_time_utc != null && typeof(queryObj.start_time_utc) == "number" && queryObj.end_time_utc != null && typeof(queryObj.end_time_utc) == "number") {
			// both timestamps
			start_time = queryObj.start_time; end_time = queryObj.end_time;
		} else if (queryObj.start_time_utc != null && typeof(queryObj.start_time_utc) == "number") { // start_time: yes, no end time
			start_time = queryObj.start_time; end_time = null;
		} else if (queryObj.end_time_utc != null && typeof(queryObj.end_time_utc) == "number") { // end_time: yes, no start time
			start_time = null; end_time = queryObj.end_time;	
		} else { //no timestamps
			start_time = null, end_time = null;
		}
	} else {
		responseHandlers.invalidRequest(response,2);
	}
	metricFunction.metric(subtype, start_time, end_time, key, val, response);
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
