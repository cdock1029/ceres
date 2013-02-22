
var fs = require('fs');
var querystring = require('querystring');
var responseHandlers = require('./responseHandlers');
var insertFunction = require('./insert');
var updateFunction = require('./update');
var deleteFunction = require('./del');
var deleteAllFunction = require('./deleteAll');
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

function collect(response, query, postData) {
var postObj;
try {
postObj = postData;
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
 var postObj;
try {
postObj = postData;
if(postObj.type != "modify" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" || typeof(postObj.data) != "object" || typeof(postObj.expr) != "object"){
responseHandlers.invalidRequest(response,2);
} else {

//responseHandlers.validRequest(response, false);
var expr = postObj.expr;	
var data = postObj.data;
var timestamp = postObj.time_utc;
updateFunction.update(expr,data,timestamp,response);
}
} catch(err){
if(err instanceof SyntaxError){ //JSON.parse failed.
responseHandlers.invalidRequest(response, 2);
}
}
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


function del(response, query, postData){
	var postObj;
	try {
		postObj = postData;
		if(postObj.type != "delete" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" || typeof(postObj.data) != "object" || typeof (postObj.justOne) != "boolean" || typeof(postObj.expr) != "object"){
			responseHandlers.invalidRequest(response,2);
		} else {

			var expr = postObj.expr;
			var flag = postObj.justOne;
			var timestamp = postObj.time_utc;
			deleteFunction.del(expr, flag,timestamp,response);
		}
	} catch(err){
		if(err instanceof SyntaxError){ //JSON.parse failed.
			responseHandlers.invalidRequest(response, 2);
		}
	}
}

function deleteAll(response, query, postData){
	var postObj;
	try {
		postObj = postData;
		if(postObj.type != "deleteAll" || typeof (postObj.time_utc) != "number" || typeof (postObj.authorize_id) != "number" ){
			responseHandlers.invalidRequest(response,2);
		} else {

			var timestamp = postObj.time_utc;
			deleteAllFunction.deleteAll(timestamp,response);
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