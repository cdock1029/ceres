#!/bin/bash

#the number of records
NUM_RECORDS=1;

echo "Testing Delete All..."
	# successful
	# node testrunner.js DELETE localhost 8880 /data delAll1.json $NUM_RECORDS & 
	
	#Invalid or improper formatting
    # node testrunner.js DELETE localhost 8880 /data delAll-no-id.json $NUM_RECORDS & 
	# node testrunner.js DELETE localhost 8880 /data delAll-misspelled.json $NUM_RECORDS & 
	 # massive socket error
	 node testrunner.js DELETE localhost 8880 /data delAll-wrong-id.json $NUM_RECORDS & 
exit 0