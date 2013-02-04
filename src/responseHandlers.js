var errcode = require('./errcode');

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

//get is a boolean - TRUE for a GET request, FALSE for a POST request.
function validRequest(response, get, data){
	var httpCode;
	if(get == true){
		httpCode = 200;
	} else {
		httpCode = 201;
		data = {};
	}
	response.writeHead(httpCode,  {"Content-Type" : "application/json" });
	responseObj =  {
		"code" : 0,
		"message" : errcode.msg[0],
		"data" : data};
		
	response.write(JSON.stringify(responseObj));
	response.end();
}

exports.invalidRequest = invalidRequest;
exports.validRequest = validRequest;
