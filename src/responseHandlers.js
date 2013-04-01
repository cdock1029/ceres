/* 
 * *---- Response Handlers ----*
 * This is the program that processes/generates responses for requests. 
 */

var errcode = require('./errcode');
//=======================================================================
// Error or invalid requests 
//=======================================================================
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
//=======================================================================
//Valid Requests
//get is a boolean - TRUE for a GET or DELETE request, FALSE for a POST or PUT request.
//=======================================================================
function validRequest(response, get, data){

	var httpCode;
	if(get == true){
		httpCode = 200;
	} else {
		httpCode = 201;
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
