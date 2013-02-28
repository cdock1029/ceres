var http = require('http');

//example from oauth spec

var options = {
  host: 'example.com',
  path: '/request?b5=%3D%253D&a3=a&c%40=&a2=r%20b',
  port: '8888',
  method: 'POST',
  headers: {
  'Authorization': 'OAuth realm="Example",    oauth_consumer_key="9djdj82h48djs9d2",	oauth_token="kkk9d7dh3k39sjv7",	oauth_signature_method="HMAC-SHA1",	oauth_signature="8HC2Q99Y%2BTrCMM%2B2hmLwVCzaOPo%3D",	oauth_timestamp="137131201",	oauth_nonce="7d8f3e4a"  	 ',
  'Content-Type' : 'application/x-www-form-urlencoded'
  }
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
req.write('c2&a3=2+q');
req.end();
