/**
Main class of the CERES application. From here the program initializes
the server, router, loads O-AUTH secrets and start listening for requests.
Starting index.js starts up the node server as per the node_config file and 
connects to the database based on the mongo_config file.
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
