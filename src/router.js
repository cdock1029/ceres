var url = require("url");

function route(handle, urlString, response, postData) {
	var pathname = url.parse(urlString).pathname;
	var query = url.parse(urlString, true).query;
    if (typeof handle[pathname] === 'function') {
      handle[pathname](response, query, postData);
    } else {
      //send 404 error
      	handle["notFound"](response, query, postData);
	    }
}

exports.route = route;
