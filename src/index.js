// Initialize konphyg with the base config dir
var config = require('konphyg')(__dirname + '/../config');
mongoConfig = config('mongodb');
nodeConfig = config('nodeServer');

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = requestHandlers.handle;

server.start(router.route, handle);
