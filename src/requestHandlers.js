/* 
 * *---- Request Handlers ----*
 * This is the main program that accepts client requests and call other functions. 
 */
var fs = require('fs');
var querystring = require('querystring');
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
handle["/collect"] = collect;
handle["/modify"] = modify;
handle["/query"] = query;
handle["/metric"] = metric;
handle["notFound"] = notFound;
handle["/delete"] = del;
handle["/deleteAll"] = deleteAll;


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
//=======================================================================
//Insertion
//=======================================================================
function collect(response, query, postData) {
	var postObj;
	try {
		postObj = postData;
		//validate data types
		if(postObj.type != "collect" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" || typeof(postObj.data) != "object"){
			responseHandlers.invalidRequest(response,2);
		} else {
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
//=======================================================================
// Modification (i.e. Update)
//=======================================================================
function modify(response, query, postData) {
	var postObj;
	try {
		postObj = postData;
		if(postObj.type != "modify" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" || typeof(postObj.data) != "object" || typeof(postObj.obj_id) != "string"){
			responseHandlers.invalidRequest(response,2);
		} else {
			var objID = postObj.obj_id;	
			var data = postObj.data;
			var timestamp = postObj.time_utc;
			updateFunction.update(objID,data,timestamp,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}
//=======================================================================
// Query 
//=======================================================================
function query(response, query, postData) {
	var queryObj;
	var queryString = decodeURIComponent(query);
	var queryJSON = querystring.parse(queryString).q;
	try {
		queryObj = JSON.parse(queryJSON);
		if(queryObj.type != "query" || typeof (queryObj.time_utc) != "number" || typeof (queryObj.authorize_id) != "number" || typeof(queryObj.expr) != "object"){
		responseHandlers.invalidRequest(response,2);
		} else {
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
//=======================================================================
// Metrics
//=======================================================================
function metric(response, query, postData) {
	var postObj;
	try {
	postObj = postData;
		if(postObj.type != "metric" || typeof (postObj.subtype != "string") || typeof (postObj.date !="number") || typeof (postObj.Start_time_utc) != "number" || typeof(postObj.End_time_utc) != "number"){
			responseHandlers.invalidRequest(response,2);
		} else {
			var type = postObj.type;
			var date = postObj.date;	
			var subtype = postObj.subtype;
			var s_time = postObj.Start_time_utc;
			var e_time = postObj.End_time_utc;
		
			//TODO: implement in python (IN-PROGRESS)
			//metricFunction.metric(type,date,subtype,s_time,e_time,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}
//=======================================================================
// Delete (single record)
//=======================================================================
function del(response, query, postData){
	var postObj;
	try {
		postObj = postData;
		if(postObj.type != "delete" || typeof (postObj.authorize_id) != "number" || typeof(postObj.obj_id) != "string"){
			responseHandlers.invalidRequest(response,2);
		} else {
			var expr = postObj.obj_id;
			deleteFunction.del(expr,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}
//=======================================================================
// Delete All Records
//=======================================================================
function deleteAll(response, query, postData){
	var postObj;
	try {
		postObj = postData;
		if(postObj.type != "deleteAll" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" ){
			responseHandlers.invalidRequest(response,2);
		} else {
			deleteAllFunction.deleteAll(response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}

//deals with 404 errors.
function notFound(response, query, postData){
responseHandlers.invalidRequest(response,3);
}

//---END REQUEST HANDLERS---

exports.handle = handle;
