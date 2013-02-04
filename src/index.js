var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = requestHandlers.handle;

server.start(router.route, handle);
