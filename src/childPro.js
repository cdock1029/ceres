var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var responseHandlers = require('./responseHandlers');

function childPro(response){
	//TODO: implement python child process (IN-PROGRESS)
			
	//spawn ?
	var p = spawn('python', './helloWorld.py');
	 if ( error != null ) {
		console.log(stderr);
		//error handling 
		responseHandlers.invalidRequest(response, 2);
	}
	else{
	p.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
		responseHandlers.validRequest(response, true, result);
	});
	
	p.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
	responseHandlers.validRequest(response, true, result);
	});

	p.on('close', function (code) {
		console.log('child process exited with code ' + code);
		responseHandlers.validRequest(response, true, result);
	});
		}		
	//exec approach ?
	/*		
	var child = exec('python', function( error, stdout, stderr){
	if ( error != null ) {
		console.log(stderr);
		//error handling 
		responseHandlers.invalidRequest(response, 2);
	}
	console.log('Child Process STDOUT: '+stdout);
	console.log('Child Process STDERR: '+stderr);		
	});	
	*/
	
		
}

exports.childPro = childPro;