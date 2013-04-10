/**
This is the main class in the CERES application. From here the program initializes
the server, router and start listening for requests for the server.
@module index.js
**/
// Initialize konphyg with the base config dir
var config = require('konphyg')(__dirname + '/../config');
mongoConfig = config('mongodb');
nodeConfig = config('nodeServer');

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var oauthLoader = require('./load-oauth-secrets');
oauthLoader.loadOAuthSecrets();
var handle = requestHandlers.handle;

server.start(router.route, handle);
