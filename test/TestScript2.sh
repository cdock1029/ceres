#!/bin/bash

#the number of records
NUM_RECORDS=1;
 echo "Testing Query..."

	 node testrunner.js GET localhost 8880 /data query1.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query2.json $NUM_RECORDS & 	
	 node testrunner.js GET localhost 8880 /data query3.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query4.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-all.json $NUM_RECORDS & 
     node testrunner.js GET localhost 8880 /data query-no-time.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-no-id.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-no-expr.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-not-found.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-no-lastname.json $NUM_RECORDS & 
	 node testrunner.js GET localhost 8880 /data query-misspelled.json $NUM_RECORDS & 
	 
exit 0