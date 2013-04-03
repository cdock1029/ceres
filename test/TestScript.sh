#!/bin/bash

#the number of records
NUM_RECORDS=1;

echo "Testing Collect..."

	 node testrunner.js POST localhost 8880 /data collect1.json $NUM_RECORDS & 
	 node testrunner.js POST localhost 8880 /data collect2.json $NUM_RECORDS & 
	 node testrunner.js POST localhost 8880 /data collect3.json $NUM_RECORDS & 
	 node testrunner.js POST localhost 8880 /data collect4.json $NUM_RECORDS & 
	 #improper format error
	 node testrunner.js POST localhost 8880 /data collect-no-id.json $NUM_RECORDS & 		
	 node testrunner.js POST localhost 8880 /data collect-no-time.json $NUM_RECORDS & 	
	 node testrunner.js POST localhost 8880 /data collect-no-data.json $NUM_RECORDS & 	
	 node testrunner.js POST localhost 8880 /data collect-wrong-type.json $NUM_RECORDS &
	 node testrunner.js POST localhost 8880 /data collect-no-type.json $NUM_RECORDS & 

exit 0