/**
Used to route the requests to the specified call.
@module router

**/
var url = require("url");
/**
This function routes the request to the correct database call
@param method A string containing the HTTP method (must be upper case).
@param headers The http headers as returned by http.ServerRequest.headers
@param scheme	A string that is either "http" or "https"
@param urlString A string containing the URL as returned by http.ServerRequest.url
@param postData A string containing the POST data (if any)
@method route
**/
function route(handle, method, urlString, response, postData) {
	var pathname = url.parse(urlString).pathname;
	var query = url.parse(urlString).query;
    if (typeof handle[pathname] === 'function') {
      handle[pathname](response, method, query, postData);
    } else {
      //send 404 error
      	handle["notFound"](response, method, query, postData);
	    }
}

exports.route = route;
