var http = require('http');


var urlParam = {
  "type" : "query",
  "authorize_id" : 0,
  "expr" : {
        "name.first": "John",
        "name.last": "Backus"
    }
};





var urlParamStr = encodeURIComponent(JSON.stringify(urlParam));
urlParamStr = 'q=' + urlParamStr;

//example from oauth spec
//var urlParamStr = 'b5=%3D%253D&a3=a&c%40=&a2=r+b'

var options = {
  host: 'localhost',
  path: '/query?' + urlParamStr,
  port: '8888',
  headers: {'Authorization': 'OAuth realm="Example",    oauth_consumer_key="9djdj82h48djs9d2",	oauth_token="",	oauth_signature_method="HMAC-SHA1",	oauth_signature="TUgxC0WQrM0Y9p8XM2OQitgO9ak%3D",	oauth_timestamp="137131200",	oauth_nonce="4572616e48616d6d65724c61686176",	oauth_version="1.0"'}
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

var req = http.request(options, callback);
req.end();
