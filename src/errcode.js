/*
* This file defines mappings between the internal error codes used by this application and the respective messages and status codes.
* This file should reflect tables 6 and 7 in the API document.
*/

var errorMapping = {
0 : "Success",
1 : "Authentication Failed",
2 : "Invalid or improperly formatted request",
3 : "Invalid URL",
4 : "MongoDB Busy",
5 : "MongoDB Error"
};

var statusCode = {
0 : 200,
1 : 401,
2 : 400,
3 : 404,
4 : 502,
5 : 500
}


exports.msg = errorMapping;
exports.httpCode = statusCode;
