var crypto = require('crypto');
var url = require("url");
var querystring = require("querystring");

// A map of oauth_consumer_keys to their corresponding shared secrets
var consumerKeySecrets;

/*
* Allows for setting the consumerKeySecrets variable.  Useful for getting these from mongo.
*/
function setConsumerKeySecrets(secrets){
	consumerKeySecrets = secrets;
}

exports.setConsumerKeySecrets = setConsumerKeySecrets;

/*
* Returns true iff the signature is valid.
* @param method A string containing the HTTP method (must be upper case).
* @param headers The http headers as returned by http.ServerRequest.headers
* @param scheme	A string that is either "http" or "https"
* @param urlString A string containing the URL as returned by http.ServerRequest.url
* @param postData A string containing the POST data (if any)
*/
function verifyOAuthSignature(method, headers, scheme, urlString, postData){
	var oauthParams = parseAuthorizationHeaders(headers['authorization']);
	if(oauthParams['oauth_version'] != null){
		if(oauthParams['oauth_version'] != "1.0"){
			return false;
		}
	}
	if(oauthParams['oauth_signature_method'] != 'HMAC-SHA1'){
		console.log('error: Unsupported OAUTH signature method.');
		return false;
	}
	//TODO: check nonce/timestamp/token combination is unique
	
	
	var calculatedSignature = createOAuthSignature(method, headers, scheme, urlString, postData);
	return calculatedSignature == oauthParams['oauth_signature'];
}

exports.verifyOAuthSignature = verifyOAuthSignature;

function createOAuthSignature(method, headers, scheme, urlString, postData){
	var bString = buildBaseString(method, headers, scheme, urlString, postData);
	var consumerKey = parseAuthorizationHeaders(headers['authorization'])['oauth_consumer_key'];
	var key = encode(consumerKeySecrets[consumerKey]) + '&';
	//future note: for writing this asynchronously, update can be called multiple times to add stuff to the hash
	return encode(crypto.createHmac('sha1',key).update(bString).digest('base64'));
}

exports.createOAuthSignature = createOAuthSignature;

function buildBaseString(method, headers, scheme, urlString, postData){
	var baseString = ''; //the string to be hashed.
	
	baseString += method + '&';
	
	//add encoded base string URI to baseString:
	//build baseURI
	var baseURI = scheme + '://';
	var host = headers['host'].toLowerCase();
	//remove standard ports as per OAUTH spec:
	if(host.charAt(host.length-1) == '8' && host.charAt(host.length) == '0'){
		//remove the :80 at the end
		host = host.substr(0,host.length-2);	
	} else if(host.charAt(host.length-2) == '4' && host.charAt(host.length-1) == '4' && host.charAt(host.length) == '3'){
		//remove the :443 at the end
		host = host.substr(0,host.length-3);
	}
	
	//add URL pathname
	baseURI += host + url.parse(urlString).pathname; 
	//encode and add to baseString
	baseString += encode(baseURI);
	
	
	baseString += '&';
	
	//add encoded and normalized request parameters to baseString
	//this includes the url parameters, the oauth parameters, and the postData
	
	//TODO: handle parameters w/ same name
	
	//url parameters
	var encodedParameters = [];
	var query = url.parse(urlString,true).query;
	for(var key in query){
		encodedParameters[encode(key)] = encode(query[key]);
	}
	//add oauth parameters.  
	var oauthParams = parseAuthorizationHeaders(headers['authorization']);
	if(oauthParams['oauth_consumer_key'] != null){
		encodedParameters['oauth_consumer_key'] = encode(decodeURIComponent(oauthParams['oauth_consumer_key']));
	}
	
	if(oauthParams['oauth_token'] != null){
		encodedParameters['oauth_token'] = encode(decodeURIComponent(oauthParams['oauth_token']));
	}
	
	if(oauthParams['oauth_signature_method'] != null){
		encodedParameters['oauth_signature_method'] = encode(decodeURIComponent(oauthParams['oauth_signature_method']));
	}
	
	if(oauthParams['oauth_timestamp'] != null){
		encodedParameters['oauth_timestamp'] = encode(decodeURIComponent(oauthParams['oauth_timestamp']));
	}
	
	if(oauthParams['oauth_nonce'] != null){
		encodedParameters['oauth_nonce'] = encode(decodeURIComponent(oauthParams['oauth_nonce']));
	}
	
	if(oauthParams['oauth_version'] != null){
		encodedParameters['oauth_version'] = encode(decodeURIComponent(oauthParams['oauth_version']));
	}
	
	//add postdata if it's urlencoded
	if(headers['content-type'] == 'application/x-www-form-urlencoded'){
		var postDataObj = querystring.parse(postData);
		for(var key in postDataObj){
			encodedParameters[encode(key)] = encode(postDataObj[key]);
		}
	}
	
	
	var encodedParamArr = [];
	var i = 0;
	//put the parameters in the correct array format for sortParams
	for(var key in encodedParameters){
		encodedParamArr[i] = [ key, encodedParameters[key] ];
		i++;
	}
	
	
	var sortedParams = sortParams(encodedParamArr);

	//add sorted parameters to base string
	var normalizedParams = '';
	for(var key in sortedParams){
		normalizedParams += sortedParams[key][0] + "=" + sortedParams[key][1];
		if(sortedParams[key] != sortedParams[sortedParams.length-1]){
			//separate parameters with &.  don't put an & after the last one
			normalizedParams += '&';
		}
	}

	//add normalized parameters to base string
	baseString += encode(normalizedParams);
	
	console.log(baseString);
	
	return baseString;
}

/*
* Returns a map containing all of the OAuth authorization headers.
* @param authHeaders A string consisting of the value of http.ServerRequest.headers['Authorization']
*/
function parseAuthorizationHeaders(authHeaders){
	var headerArray = authHeaders.split(',');
	var headerMap = [];
	
	for(i = 0; i < headerArray.length; i++){
		var oauthParameter = headerArray[i].split('='); //index 0 is key, index 1 is value
		var oauthVal = oauthParameter[1].trim().replace(/\"/g, '');
		headerMap[oauthParameter[0].trim()] = oauthVal;  //get rid of quotes 
	}
	
	
	return headerMap;
}


/*
* COPYRIGHT NOTICE:
* The encode, decode, and sortParams functions were taken and/or modified from https://github.com/selead/oauth-server/blob/master/lib/util.js
* They were used WITH PERMISSION from the author.
*/

/*
* Encodes a string according to the format defined in https://tools.ietf.org/html/rfc5849#section-3.6
*/
function encode(dataString){
	var uriEncoded = encodeURIComponent(dataString);
	//still need to replace the following symbols that encodeURIComponent didn't replace: ! * ' ( )
	//also encode spaces as %20, not +
	var oauthEncoded = uriEncoded.replace(/\!/g, '%21').replace(/\*/g, '%2A').replace(/\'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\+/g, '%20');
	return oauthEncoded;

}

/*
* Decodes a string that was encoded according to the format defined in https://tools.ietf.org/html/rfc5849#section-3.6
*/
function decode(dataString){
    return decodeURIComponent( data !== null ? data.replace(/\+/g, " ") : data);
}

function sortParams (params) {
    params.sort(function (a, b) {
        if ( a[0] === b[0] ) {
            return a[1] < b[1] ? -1 : 1;
        }
        else {
            return a[0] < b[0] ? -1: 1;
        }});
    return params;
}
