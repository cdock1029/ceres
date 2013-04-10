#!/bin/bash

#the number of records
NUM_RECORDS=1;

echo "Testing Delete..."
#	node testrunner.js GET localhost 8888 /metrics metrics-count.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-count1.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-invalidTime.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-max.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-min.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-missingdata.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-std.json $NUM_RECORDS & 
#	node testrunner.js GET localhost 8888 /metrics metrics-var.json $NUM_RECORDS & 
	node testrunner.js GET localhost 8888 /metrics metrics-zeroperiod.json $NUM_RECORDS & 
	
exit 0	 
