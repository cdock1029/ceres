#!/bin/bash

#the number of records
NUM_RECORDS=1;

echo "Testing Update ..."
	 node testrunner.js PUT localhost 8880 /data update1.json $NUM_RECORDS & 
	 node testrunner.js PUT localhost 8880 /data update2.json $NUM_RECORDS & 
	 node testrunner.js PUT localhost 8880 /data update3.json $NUM_RECORDS & 
	 node testrunner.js PUT localhost 8880 /data update4.json $NUM_RECORDS & 
	 node testrunner.js PUT localhost 8880 /data update-empty-data.json $NUM_RECORDS &
	node testrunner.js PUT localhost 8880 /data update-no-Authid.json $NUM_RECORDS & 
	node testrunner.js PUT localhost 8880 /data update-no-data.json $NUM_RECORDS &
	node testrunner.js PUT localhost 8880 /data update-no-objid.json $NUM_RECORDS &
	node testrunner.js PUT localhost 8880 /data update-no-time.json $NUM_RECORDS &
	node testrunner.js PUT localhost 8880 /data update-wrong-type.json $NUM_RECORDS &
	
exit 0
	