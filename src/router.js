var url = require("url");

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
