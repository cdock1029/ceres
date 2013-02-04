var fs = require('fs');
var errcode = require('./errcode');
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
	} catch(err){
		console.log(err);
		invalidRequest(response, 2);
	}
	
	if(postObj.type != "collect"){
		invalidRequest(response,2);
	} else {
	
	response.writeHead(201, {"Content-Type" : "application/json"});
	responseObj =  {
		"code" : 0,
		"message" : errcode.msg[0],
		"data" : {}};
		
	response.write(JSON.stringify(responseObj));
	response.end();
	
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
invalidRequest(response,3);
}


//---END REQUEST HANDLERS---

function invalidRequest(response, code){
	console.log("error: " + code);
	response.writeHead(errcode.httpCode[code],  {"Content-Type" : "application/json" });
	responseObj =  {
		"code" : code,
		"message" : errcode.msg[code],
		"data" : {}};
		
	response.write(JSON.stringify(responseObj));
	response.end();
}



exports.handle = handle;
